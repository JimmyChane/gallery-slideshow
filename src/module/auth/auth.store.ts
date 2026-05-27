import { LinearQueueHandler, optString, waitMs } from '@chanzor/utils';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { HOME_ROUTE } from '@/pages/home/home.route';
import { LOGIN_ROUTE } from '@/pages/login/login.route';

import { useAuthRefreshStore } from './auth-refresh.store';
import { authExchange, authGetSelf, authLogin } from './auth.api';
import { UserModel } from './user.model';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const authRefreshStore = useAuthRefreshStore();

  const queue = new LinearQueueHandler();

  const user = ref<UserModel>();

  const isInitializing = ref(true);
  const isLogging = ref(false);

  const error = ref<string>();

  function getUser(): Promise<UserModel | undefined> {
    return queue.next(async () => {
      return user.value;
    });
  }

  async function login(username: string, password: string): Promise<void> {
    let run = true;

    run = await queue.next(async () => {
      if (authRefreshStore.isActive) return false;

      isLogging.value = true;
      error.value = undefined;

      const loginRes = await authLogin(username, password).catch(
        (e: Error) => e,
      );
      if (loginRes instanceof Error) {
        error.value = 'Authentication failed';
        isLogging.value = false;
        return false;
      }

      const loginToken = optString(loginRes.data.loginToken);
      const exchangeRes = await authExchange(loginToken).catch((e: Error) => e);
      if (exchangeRes instanceof Error) {
        error.value = 'Authentication failed';
        isLogging.value = false;
        return false;
      }

      await authRefreshStore.setRefreshToken(
        optString(exchangeRes.data.refreshToken),
      );

      return true;
    });

    if (!run) return;

    await queue.next(async () => {
      await refreshSelf();
    });

    await queue.next(async () => {
      isLogging.value = false;
      error.value = undefined;

      router.push(HOME_ROUTE.path);
    });
  }

  async function logout(): Promise<void> {
    await queue.next(async () => {
      authRefreshStore.clear();
      user.value = undefined;
      router.push(LOGIN_ROUTE.path);
    });
  }

  async function refreshToken(): Promise<void> {
    await queue.next(async () => {
      if (!authRefreshStore.isActive) {
        authRefreshStore.clear();
        user.value = undefined;
        router.push(LOGIN_ROUTE.path);
        return;
      }

      await authRefreshStore.refresh();
    });

    await refreshSelf();
  }

  async function refreshSelf(): Promise<void> {
    const selfRes = await authGetSelf();

    user.value = new UserModel(
      optString(selfRes.data.userId),
      optString(selfRes.data.username),
    );
  }

  onMounted(async () => {
    while (authRefreshStore.isInitializing) await waitMs(500);

    if (authRefreshStore.isActive) {
      await refreshSelf();
      router.push(HOME_ROUTE.path);
    } else {
      await logout();
    }

    isInitializing.value = false;
  });

  return {
    isInitializing: computed(() => isInitializing.value),
    isLogging: computed(() => isLogging.value),
    error,
    user: computed(() => user.value),

    getUser,
    login,
    logout,
    refresh: refreshToken,
  };
});
