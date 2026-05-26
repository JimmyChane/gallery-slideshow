import type { RouteRecordRaw } from 'vue-router';

import { RouteKey } from '@/router/Route.key';

import LoginPage from './Login.page.vue';

export const LOGIN_ROUTE = {
  name: RouteKey.LOGIN,
  path: '/login',
  component: LoginPage,
} satisfies RouteRecordRaw;
