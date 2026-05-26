import type { RouteRecordRaw } from 'vue-router';

import HomePage from './Home.page.vue';

export const HOME_ROUTE = {
  path: '/home',
  component: HomePage,
} satisfies RouteRecordRaw;
