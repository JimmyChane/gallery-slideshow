import axios from 'axios';

import { ENV_BACKEND_API_BASE } from '@/config/env';
import { useAuthStore } from '@/stores/auth/auth.store';

export const API = axios.create({
  baseURL: ENV_BACKEND_API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();

    if (authStore.accessToken?.length) {
      config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const originalRequest = error.config;

    // Check if error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(
          `${ENV_BACKEND_API_BASE}/auth/refresh`,
          { refreshToken: authStore.refreshToken },
        );

        const { accessToken, refreshToken } = response.data;

        authStore.accessToken = accessToken;
        authStore.refreshToken = refreshToken;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
