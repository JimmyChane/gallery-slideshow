import { createRouter, createWebHistory } from 'vue-router';

import { HOME_ROUTE } from './routes';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    HOME_ROUTE.toVueRoute(),
    { path: '/:pathMatch(.*)*', redirect: { name: HOME_ROUTE.id } },
  ],
});

export default router;
