<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { useConfig } from '~/src/composables/useConfig';
import { useServerFilenames } from '~/src/composables/useServerFilenames';
import { ImageModel } from '~/src/model/Image.model';
import { ImagePathModel } from '~/src/model/ImagePath.model';

import Slideshow from '~/src/pages/home/components/Slideshow.vue';

const { host, accessToken } = useConfig();

const { filenames, error, refresh } = useServerFilenames(host, accessToken);
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
    const url = new URL(`${host.value}/public/${filename} `);
    url.searchParams.append('t', accessToken.value);

    return new ImagePathModel(url.toString());
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
