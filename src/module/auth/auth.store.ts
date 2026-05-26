import { useLocalStorage } from '@vueuse/core';
import axios from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { ENV_BACKEND_API_BASE } from '@/config/env';
import { LOGIN_ROUTE } from '@/pages/login/login.route';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();

  // State managed by VueUse (Syncs with LocalStorage automatically)
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

  async function login(username: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      // Step 1: Login to get loginToken
      const loginRes = await axios.post(`${ENV_BACKEND_API_BASE}/auth/login`, {
        username,
        password,
      });

      const { loginToken } = loginRes.data;

      // Step 2: Exchange loginToken for final tokens
      const exchangeRes = await axios.post(
        `${ENV_BACKEND_API_BASE}/auth/exchange`,
        { loginToken },
      );

      const { accessToken: access, refreshToken: refresh } = exchangeRes.data;

      // Save to LocalStorage via VueUse refs
      accessTokenLocal.value = access;
      refreshTokenLocal.value = refresh;

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
    const response = await axios.post(`${ENV_BACKEND_API_BASE}/auth/refresh`, {
      refreshToken: refreshTokenLocal.value,
    });

    const { accessToken: access, refreshToken: refresh } = response.data;

    // Step 2: Update the store (which updates LocalStorage via VueUse)
    accessTokenLocal.value = access;
    refreshTokenLocal.value = refresh;
  }

  return {
    accessToken: accessTokenLocal,
    refreshToken: refreshTokenLocal,
    isLoading,
    error,
    login,
    logout,
    refresh,
  };
});
