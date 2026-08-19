import { LinearQueueHandler, optString, waitMs } from '@chanzor/utils';
import { useLocalStorage } from '@vueuse/core';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';

import { ENV_BACKEND_API_BASE } from '@/config/env';

export function fetchRefresh(refreshToken: string) {
  return axios.post<{ accessToken?: string; refreshToken?: string }>(
    `${ENV_BACKEND_API_BASE}/auth/refresh`,
    { refreshToken },
  );
}

export const useAuthRefreshStore = defineStore('auth-refresh', () => {
  const queue = new LinearQueueHandler();

  const isInitializing = ref(true);

  const isActive = computed(() => {
    return (
      !!refreshTokenLocal.value?.length && !!accessTokenLocal.value?.length
    );
  });

  const refreshTokenLocal = useLocalStorage<string | undefined>(
    'refresh',
    undefined,
    { writeDefaults: false },
  );
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

    const response = await fetchRefresh(refreshTokenLocal.value).catch(
      (e: Error) => e,
    );
    if (response instanceof AxiosError) {
      if (response.status === 401) {
        clear();
        return;
      }
    }
    if (response instanceof Error) {
      clear();
      return;
    }

    accessTokenLocal.value = optString(response.data.accessToken);
    refreshTokenLocal.value = optString(response.data.refreshToken);
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
