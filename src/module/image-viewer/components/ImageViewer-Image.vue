<script setup lang="ts">
import { computedAsync, debouncedRef, useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

import { useImageViewerStore } from '../image-viewer.store';

const imageViewerStore = useImageViewerStore();

const windowSize = useWindowSize();
const debouncedWindowWidth = debouncedRef(windowSize.width, 1_000);
const debouncedWindowHeight = debouncedRef(windowSize.height, 1_000);

const src = computedAsync<string | undefined>(async () => {
  if (debouncedWindowWidth.value > debouncedWindowHeight.value) {
    return imageViewerStore.model?.getSrc(debouncedWindowHeight.value, undefined);
  } else if (debouncedWindowWidth.value < debouncedWindowHeight.value) {
    return imageViewerStore.model?.getSrc(undefined, debouncedWindowWidth.value);
  } else {
    return imageViewerStore.model?.getSrc(debouncedWindowWidth.value, debouncedWindowHeight.value);
  }
});

const isLoading = ref(true);

watch(src, () => (isLoading.value = true));

function onLoad(): void {
  isLoading.value = false;
}
</script>

<template>
  <div class="image-viewer-overlay-img" :data-loading="isLoading">
    <img :src @load="onLoad" />
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay-img {
  z-index: 2;

  max-width: 100%;
  max-height: 100%;

  display: flex;

  & > img {
    max-width: 100%;
    max-height: 100%;
    display: flex;

    user-select: none;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    border-radius: 0.5rem;
    transition: all 700ms ease;
  }

  &[data-loading='true'] {
    img {
      opacity: 0;
    }
  }
  &[data-loading='false'] {
    img {
      opacity: 1;
    }
  }
}
</style>
