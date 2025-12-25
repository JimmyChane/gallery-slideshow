import { type Router, createRouter, createWebHistory } from 'vue-router';

import { RouteKey } from './Route.key';

import HomePage from '@/pages/home/Home.page.vue';

export async function buildRouter(): Promise<Router> {
  const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
      { name: RouteKey.HOME, path: '/', component: HomePage },
      { path: '/:pathMatch(.*)*', redirect: { name: RouteKey.HOME } },
    ],
  });

  return router;
}
