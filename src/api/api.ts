import axios from 'axios';

import { ENV_BACKEND_API_BASE } from '@/config/env';
import { useAuthStore } from '@/module/auth/auth.store';

export const APP_API = axios.create({
  baseURL: ENV_BACKEND_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

APP_API.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore().getAccessToken();

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
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authStore.refresh();
        originalRequest.headers.Authorization = `Bearer ${authStore.getAccessToken()}`;
        return APP_API(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
