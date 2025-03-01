import { markRaw } from 'vue';

import { AppRoute } from '@/app.store';

import HomeIcon from '@/components/Home.icon.vue';

export const HOME_ROUTE = new AppRoute('home', {
  path: '/',
  title: 'Home',
  icon: markRaw(HomeIcon),
  page: () => import('@/pages/Home.page.vue'),
});
