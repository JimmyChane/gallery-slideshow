<script setup lang="ts">
import { waitMs } from '@chanzor/utils';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { useServerFilenames } from '@/composables/useServerFilenames';
import type { ImageModel } from '@/model/Image.model';
import { ImagePathModel } from '@/model/ImagePath.model';

import Slideshow from './components/Slideshow.vue';

const { filenames, error, refresh } = useServerFilenames();
const errorMessage = computed(() => {
  if (error.value) return error.value.message || 'Unknown error';
});

const imageModels = ref<ImageModel[]>([]);

const push = (filename: string): void => {
  imageModels.value.push(new ImagePathModel(filename));
};

let loadTime = 0;

onMounted(async () => {
  const now = (loadTime = Date.now());

  await refresh();
  if (now !== loadTime) return;

  const shuffledFilenames = filenames.value.sort(() => Math.random() - 0.5);
  for (const filename of shuffledFilenames) {
    push(filename);
    await waitMs(200);
    if (now !== loadTime) return;
  }
});

onUnmounted(() => {
  imageModels.value = [];
  loadTime = Date.now();
});
</script>

<template>
  <div class="home-page">
    <div v-if="errorMessage?.length" class="home-page-view">
      <span>{{ errorMessage }}</span>
      <button @click="() => refresh()">Try Again</button>
    </div>

    <Slideshow v-else-if="imageModels.length > 0" :models="imageModels" />

    <div v-else class="home-page-view">No images found</div>
  </div>
</template>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100%;

  display: flex;

  background: linear-gradient(90deg, #333333 0%, #141c1d 100%);

  .home-page-view {
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
}
</style>
