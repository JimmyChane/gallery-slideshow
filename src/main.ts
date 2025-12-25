import { createPinia } from 'pinia';
import { createApp } from 'vue';

import './main.css';
import { buildRouter } from './router/router';

import App from './App.vue';

async function buildApp(): Promise<void> {
  const router = await buildRouter();
  const app = createApp(App);
  app.use(router);
  app.use(createPinia());
  app.mount('#app');
}
buildApp();
