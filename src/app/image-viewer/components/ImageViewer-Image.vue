<script setup lang="ts">
import { computedAsync, debouncedRef, useWindowSize } from '@vueuse/core';
import { ref, watch } from 'vue';

import type { ImageModel } from '@/model/Image.model';

const { model } = defineProps<{
  model?: ImageModel;
  showing: boolean;
  active: boolean;
}>();

const windowSize = useWindowSize();
const debouncedWindowWidth = debouncedRef(windowSize.width, 1_000);
const debouncedWindowHeight = debouncedRef(windowSize.height, 1_000);

const src = computedAsync<string | undefined>(async () => {
  if (debouncedWindowWidth.value > debouncedWindowHeight.value) {
    return model?.getSrc(debouncedWindowHeight.value, undefined);
  } else if (debouncedWindowWidth.value < debouncedWindowHeight.value) {
    return model?.getSrc(undefined, debouncedWindowWidth.value);
  } else {
    return model?.getSrc(
      debouncedWindowWidth.value,
      debouncedWindowHeight.value,
    );
  }
});

const isLoading = ref(true);

watch(src, () => (isLoading.value = true));

const onLoad = (): void => {
  isLoading.value = false;
};
</script>

<template>
  <div class="image-viewer-overlay-img" :data-loading="isLoading">
    <div class="image-placeholder"></div>
    <img :src @load="onLoad" />
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay-img {
  z-index: 2;

  max-width: 100%;
  max-height: 100%;

  display: flex;

  .image-placeholder {
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    background-color: #000;
    border-radius: 1rem;
    transition: all 700ms ease;
  }

  & > img {
    display: flex;

    user-select: none;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 1rem;
    overflow: hidden;
    border-radius: 1rem;
    transition: all 700ms ease;
  }

  &[data-loading='true'] {
    .image-placeholder {
      opacity: 1;
    }
    img {
      opacity: 0;
    }
  }
  &[data-loading='false'] {
    .image-placeholder {
      opacity: 0;
    }
    img {
      opacity: 1;
    }
  }
}
</style>
