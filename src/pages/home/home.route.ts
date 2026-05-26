import type { RouteRecordRaw } from 'vue-router';

import { RouteKey } from '@/router/Route.key';

import HomePage from './Home.page.vue';

export const HOME_ROUTE = {
  name: RouteKey.HOME,
  path: '/home',
  component: HomePage,
} satisfies RouteRecordRaw;
