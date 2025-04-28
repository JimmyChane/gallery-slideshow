<script setup lang="ts">
import { useRuntimeConfig } from '#app';
import { computed, onMounted, ref } from 'vue';

import { useServerFilenames } from '~/src/api/ServerFilenames.api';
import { ImageModel } from '~/src/model/Image.model';
import { ImagePathModel } from '~/src/model/ImagePath.model';

import Slideshow from '~/src/pages/home/components/Slideshow.vue';

const config = useRuntimeConfig();

const host = computed(() => config.public.BACKEND_HOST);
if (typeof host.value !== 'string') {
  throw new Error('BACKEND_HOST is not defined');
}

const { filenames, error, refresh } = useServerFilenames(
  config.public.BACKEND_HOST,
);
const errorMessage = computed(() => {
  if (error.value) return error.value.message || 'Unknown error';
});

const imageModels = ref<ImageModel[]>([]);

const isMounted = ref(false);

onMounted(() => {
  if (!filenames.value.length) {
    isMounted.value = true;
    return;
  }

  imageModels.value = filenames.value.map((filename) => {
    return new ImagePathModel(
      `${config.public.BACKEND_HOST}/public/${filename}`,
    );
  });

  isMounted.value = true;
});
</script>

<template>
  <div v-if="isMounted" class="home-page">
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
