<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useAuthStore } from './module/auth/auth.store.ts';

import ImageViewerApp from './module/image-viewer/ImageViewer.app.vue';

useAuthStore();
</script>

<template>
  <div class="app">
    <RouterView style="z-index: 1" />
    <ImageViewerApp style="z-index: 2" />
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: stretch;
  justify-content: stretch;
}
</style>
