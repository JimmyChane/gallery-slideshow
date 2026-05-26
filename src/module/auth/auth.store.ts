import { optString } from '@chanzor/utils';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_ROUTE } from '@/pages/login/login.route';

import { authExchange, authLogin, authRefresh } from './auth.api';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  const accessTokenLocal = useLocalStorage<string | undefined>(
    'accessToken',
    undefined,
    { writeDefaults: false },
  );
  const refreshTokenLocal = useLocalStorage<string | undefined>(
    'refreshToken',
    undefined,
    { writeDefaults: false },
  );

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function getAccessToken(): string | undefined {
    return accessTokenLocal.value;
  }

  async function login(username: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      const loginRes = await authLogin(username, password);
      const loginToken = optString(loginRes.data.loginToken);

      const exchangeRes = await authExchange(loginToken);

      accessTokenLocal.value = optString(exchangeRes.data.accessToken);
      refreshTokenLocal.value = optString(exchangeRes.data.refreshToken);

      return true;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Authentication failed';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout(): void {
    accessTokenLocal.value = undefined;
    refreshTokenLocal.value = undefined;

    router.push(LOGIN_ROUTE.path);
  }

  async function refresh(): Promise<void> {
    if (!refreshTokenLocal.value?.length) {
      logout();
      return;
    }

    const response = await authRefresh(refreshTokenLocal.value);
    accessTokenLocal.value = optString(response.data.accessToken);
    refreshTokenLocal.value = optString(response.data.refreshToken);
  }

  return {
    accessToken: computed(() => accessTokenLocal.value),
    isLoading,
    error,
    getAccessToken,
    login,
    logout,
    refresh,
  };
});
