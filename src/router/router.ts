import { type Router, createRouter, createWebHistory } from 'vue-router';

import { HOME_ROUTE } from '@/pages/home/home.route';
import { LOGIN_ROUTE } from '@/pages/login/login.route';

export async function buildRouter(): Promise<Router> {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      LOGIN_ROUTE,
      HOME_ROUTE,
      { path: '/:pathMatch(.*)*', redirect: HOME_ROUTE.path },
    ],
  });

  return router;
}
