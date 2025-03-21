import { createPinia } from 'pinia';
import { createApp } from 'vue';

import '@/main.css';
import router from '@/router';

import App from '@/app/App.vue';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.mount('#app');
