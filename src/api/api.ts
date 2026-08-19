import axios from 'axios';

import { ENV_BACKEND_API_BASE } from '@/config/env';
import { useAuthRefreshStore } from '@/module/auth/auth-refresh.store';

export const APP_API = axios.create({ baseURL: ENV_BACKEND_API_BASE, headers: { 'Content-Type': 'application/json' } });

APP_API.interceptors.request.use(
  async (config) => {
    const authRefreshStore = useAuthRefreshStore();
    const accessToken = await authRefreshStore.getAccessToken();

    if (accessToken?.length) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

APP_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authRefreshStore = useAuthRefreshStore();
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authRefreshStore.refresh();
        const accessToken = await authRefreshStore.getAccessToken();

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return APP_API(originalRequest);
      } catch (refreshError) {
        authRefreshStore.clear();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
