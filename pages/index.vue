<script setup lang="ts">
import { useFetch } from '#app';
import { type MaybeUndefined, optArray } from '@chanzor/utils';
import { onMounted, ref } from 'vue';

import { BACKEND_HOST } from '~/src/config';
import { ImageHolderModel } from '~/src/model/ImageHolder.model';

import Slideshow from '~/src/pages/home/components/Slideshow.vue';

const {
  data: imageFilenames,
  status,
  error,
  refresh,
} = await useFetch<MaybeUndefined<string[]>>(
  `${BACKEND_HOST}/api/public/filenames`,
  { default: () => [] },
);

const imageModels = ref<ImageHolderModel[]>([]);

onMounted(() => {
  const filenames = optArray(imageFilenames.value);

  if (!filenames.length) return [];

  const models = filenames.map((filename) => {
    return new ImageHolderModel(`${BACKEND_HOST}/public/${filename}?w=270`);
  });

  imageModels.value = models;
});
</script>

<template>
  <div class="home-page">
    <div v-if="status === 'pending'" class="loading-indicator">
      Loading images...
    </div>

    <div v-else-if="error" class="error-message">
      <p>Failed to load images: {{ error.message || 'Unknown error' }}</p>
      <button @click="() => refresh()">Try Again</button>
    </div>

    <Slideshow v-else-if="imageModels.length > 0" :models="imageModels" />

    <div v-else class="empty-state">No images found.</div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;

  display: flex;

  background: linear-gradient(90deg, #333333 0%, #141c1d 100%);
}
</style>
