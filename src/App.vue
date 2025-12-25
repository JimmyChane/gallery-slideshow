<script setup lang="ts">
import { RouterView } from 'vue-router';

import ImageViewerOverlay from './app/components/ImageViewerOverlay.vue';
</script>

<template>
  <div class="app">
    <RouterView style="z-index: 1" />
    <ImageViewerOverlay style="z-index: 2" />
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
