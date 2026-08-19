import type { RouteRecordRaw } from 'vue-router';

import LoginPage from './Login.page.vue';

export const LOGIN_ROUTE = { path: '/login', component: LoginPage } satisfies RouteRecordRaw;
