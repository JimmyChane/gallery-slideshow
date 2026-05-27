<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useAuthStore } from './module/auth/auth.store.ts';

import ImageViewerApp from './module/image-viewer/ImageViewer.app.vue';

const authStore = useAuthStore();
</script>

<template>
  <div class="app">
    <div
      v-if="authStore.isInitializing"
      class="app-auth-loading"
      style="z-index: 1"
    >
      <div class="spinner"></div>
      <span>Authenticating...</span>
    </div>
    <RouterView v-else style="z-index: 1" />

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

  .app-auth-loading {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: #121212;
    color: #00dc82;
    z-index: 999;

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(0, 220, 130, 0.2);
      border-top-color: #00dc82;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
