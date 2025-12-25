<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useServerFilenames } from '@/composables/useServerFilenames';
import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_HOST } from '@/config/env';
import type { ImageModel } from '@/model/Image.model';
import { ImagePathModel } from '@/model/ImagePath.model';

import Slideshow from './components/Slideshow.vue';

const { filenames, error, refresh } = useServerFilenames();
const errorMessage = computed(() => {
  if (error.value) return error.value.message || 'Unknown error';
});

const imageModels = ref<ImageModel[]>([]);

onMounted(async () => {
  await refresh();

  imageModels.value = filenames.value.map((filename) => {
    const url = new URL(`${ENV_BACKEND_API_HOST}/public/${filename} `);
    url.searchParams.append('t', ENV_ACCESS_TOKEN);

    return new ImagePathModel(url.toString());
  });
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
