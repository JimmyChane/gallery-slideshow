import axios from 'axios';

import { APP_API } from '@/api/api';
import { ENV_BACKEND_API_BASE } from '@/config/env';

export function authLogin(username: string, password: string) {
  return axios.post<{ loginToken?: string }>(
    `${ENV_BACKEND_API_BASE}/auth/login`,
    { username, password },
  );
}

export function authExchange(loginToken: string) {
  return axios.post<{ accessToken?: string; refreshToken?: string }>(
    `${ENV_BACKEND_API_BASE}/auth/exchange`,
    { loginToken },
  );
}

export function authRefresh(refreshToken: string) {
  return axios.post<{ accessToken?: string; refreshToken?: string }>(
    `${ENV_BACKEND_API_BASE}/auth/refresh`,
    { refreshToken },
  );
}

export function authGetSelf() {
  return APP_API.get<{ userId?: string; username?: string }>('/auth/self');
}
