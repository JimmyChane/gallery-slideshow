<script setup lang="ts">
import { useHead } from '#app';

import ImageViewerOverlay from './src/app/components/ImageViewerOverlay.vue';

useHead({
  title: 'Jimmy Chane',
  link: [{ rel: 'icon', href: 'https://www.jimmychane.com/icon/favicon.ico' }],
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },

    // Twitter Meta
    { name: 'twitter:title', content: 'Jimmy Chane' },
    {
      name: 'twitter:image',
      content: 'https://www.jimmychane.com/icon/og-image.png',
    },
    {
      name: 'twitter:description',
      content: "I'm Jimmy Chane, Programmer | Artist",
    },

    // Open Graph Meta (for Facebook, LinkedIn, etc.)
    { name: 'title', property: 'og:title', content: 'Jimmy Chane' },
    { name: 'type', property: 'og:type', content: 'website' },
    {
      name: 'image',
      property: 'og:image',
      content: 'https://www.jimmychane.com/icon/og-image.png',
    },
    { name: 'url', property: 'og:url', content: 'https://www.jimmychane.com' },
    {
      name: 'description',
      property: 'og:description',
      content: "I'm Jimmy Chane, Programmer | Artist",
    },
  ],
});
</script>

<template>
  <div class="app">
    <NuxtPage style="z-index: 1" />
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
