import { type RouteRecordRaw, type Router, createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/home/Home.page.vue';
import LoginPage from '@/pages/login/Login.page.vue';

export const ROUTE_HOME = { path: '/home', component: HomePage } satisfies RouteRecordRaw;
export const ROUTE_LOGIN = { path: '/login', component: LoginPage } satisfies RouteRecordRaw;

export async function buildRouter(): Promise<Router> {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [ROUTE_LOGIN, ROUTE_HOME, { path: '/:pathMatch(.*)*', redirect: ROUTE_HOME.path }],
  });

  return router;
}
