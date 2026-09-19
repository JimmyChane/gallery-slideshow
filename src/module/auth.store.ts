import { LinearQueueHandler, optString, waitMs } from '@chanzor/utils';
import { useLocalStorage } from '@vueuse/core';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { API_SERVER } from '@/api/api';
import { ENV_BACKEND_API_BASE } from '@/config/env';
import { ROUTE_HOME, ROUTE_LOGIN } from '@/router/router';

export class UserModel {
  constructor(
    readonly userId: string,
    readonly username: string,
  ) {}
}

function fetchLogin(username: string, password: string) {
  return axios.post<{ loginToken?: string }>(`${ENV_BACKEND_API_BASE}/auth/login`, { username, password });
}

function fetchExchange(loginToken: string) {
  return axios.post<{ accessToken?: string; refreshToken?: string }>(`${ENV_BACKEND_API_BASE}/auth/exchange`, {
    loginToken,
  });
}

function fetchGetSelf() {
  return API_SERVER.get<{ userId?: string; username?: string }>('/auth/self');
}

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

      const loginRes = await fetchLogin(username, password).catch((e: Error) => e);
      if (loginRes instanceof Error) {
        error.value = 'Authentication failed';
        isLogging.value = false;
        return false;
      }

      const loginToken = optString(loginRes.data.loginToken);
      const exchangeRes = await fetchExchange(loginToken).catch((e: Error) => e);
      if (exchangeRes instanceof Error) {
        error.value = 'Authentication failed';
        isLogging.value = false;
        return false;
      }

      await authRefreshStore.setRefreshToken(optString(exchangeRes.data.refreshToken));

      return true;
    });

    if (!run) return;

    await queue.next(async () => {
      await refreshSelf();
    });

    await queue.next(async () => {
      isLogging.value = false;
      error.value = undefined;

      router.push(ROUTE_HOME.path);
    });
  }

  async function logout(): Promise<void> {
    await queue.next(async () => {
      authRefreshStore.clear();
      user.value = undefined;
      router.push(ROUTE_LOGIN.path);
    });
  }

  async function refreshToken(): Promise<void> {
    await queue.next(async () => {
      if (!authRefreshStore.isActive) {
        authRefreshStore.clear();
        user.value = undefined;
        router.push(ROUTE_LOGIN.path);
        return;
      }

      await authRefreshStore.refresh();
    });

    await refreshSelf();
  }

  async function refreshSelf(): Promise<void> {
    const selfRes = await fetchGetSelf().catch((e: Error) => e);

    if (selfRes instanceof Error) {
      user.value = undefined;
      throw selfRes;
    }

    user.value = new UserModel(optString(selfRes.data.userId), optString(selfRes.data.username));
  }

  onMounted(async () => {
    while (authRefreshStore.isInitializing) await waitMs(500);

    if (authRefreshStore.isActive) {
      await refreshSelf();
      router.push(ROUTE_HOME.path);
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

// REFRESH

function fetchRefresh(refreshToken: string) {
  return axios.post<{ accessToken?: string; refreshToken?: string }>(`${ENV_BACKEND_API_BASE}/auth/refresh`, {
    refreshToken,
  });
}

export const useAuthRefreshStore = defineStore('auth-refresh', () => {
  const queue = new LinearQueueHandler();

  const isInitializing = ref(true);

  const isActive = computed(() => {
    return !!refreshTokenLocal.value?.length && !!accessTokenLocal.value?.length;
  });

  const refreshTokenLocal = useLocalStorage<string | undefined>('refresh', undefined, { writeDefaults: false });
  const accessTokenLocal = ref<string>();

  function clear(): void {
    accessTokenLocal.value = undefined;
    refreshTokenLocal.value = undefined;
  }

  async function refresh(): Promise<void> {
    if (!refreshTokenLocal.value?.length) {
      clear();
      return;
    }

    const res = await fetchRefresh(refreshTokenLocal.value).catch((e: Error) => e);
    if (res instanceof AxiosError) {
      if (res.status === 401) clear();
    } else if (res instanceof Error) {
      clear();
    } else {
      accessTokenLocal.value = optString(res.data.accessToken);
      refreshTokenLocal.value = optString(res.data.refreshToken);
    }
  }

  async function setRefreshToken(refreshToken: string): Promise<void> {
    refreshTokenLocal.value = refreshToken;
    await refresh();
  }

  onMounted(async () => {
    if (refreshTokenLocal.value?.length) await refresh();
    isInitializing.value = false;
  });

  return {
    isInitializing: computed(() => isInitializing.value),
    isActive,

    clear: async () => {
      while (isInitializing.value) await waitMs(500);
      clear();
    },
    getAccessToken: async () => {
      while (isInitializing.value) await waitMs(500);
      return accessTokenLocal.value;
    },
    refresh: async () => {
      while (isInitializing.value) await waitMs(500);
      await queue.next(async () => {
        await refresh();
      });
    },
    setRefreshToken: async (refreshToken: string) => {
      while (isInitializing.value) await waitMs(500);
      await setRefreshToken(refreshToken);
    },
  };
});
