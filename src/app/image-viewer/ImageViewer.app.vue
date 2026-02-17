<script setup lang="ts">
import {
  computedAsync,
  debouncedRef,
  onClickOutside,
  useElementBounding,
  useElementSize,
  useWindowSize,
} from '@vueuse/core';
import { useTemplateRef } from 'vue';

import { useAppStore } from '@/stores/app.store';

import ImageViewerBackground from './components/ImageViewer-Background.vue';
import ImageViewerContainer from './components/ImageViewer-Container.vue';

const appStore = useAppStore();

const windowSize = useWindowSize();
const debouncedWindowWidth = debouncedRef(windowSize.width, 1_000);
const debouncedWindowHeight = debouncedRef(windowSize.height, 1_000);

const src = computedAsync<string | undefined>(async () => {
  if (debouncedWindowWidth.value > debouncedWindowHeight.value) {
    return appStore.model?.getSrc(debouncedWindowHeight.value, undefined);
  } else if (debouncedWindowWidth.value < debouncedWindowHeight.value) {
    return appStore.model?.getSrc(undefined, debouncedWindowWidth.value);
  } else {
    return appStore.model?.getSrc(
      debouncedWindowWidth.value,
      debouncedWindowHeight.value,
    );
  }
});

// TODO: fix swapping betwen images as transition

const imageRef = useTemplateRef('imageRef');
onClickOutside(imageRef, () => {
  if (appStore.isShowing) appStore.close();
});
const { width: imageWidth, height: imageHeight } = useElementSize(imageRef);
const { left: imageLeft, top: imageTop } = useElementBounding(imageRef);
</script>

<template>
  <ImageViewerContainer
    :width="appStore.startWidth"
    :height="appStore.startHeight"
    :top="appStore.startY"
    :left="appStore.startX"
    :showing="appStore.isShowing"
    :active="appStore.isActive"
  >
    <ImageViewerBackground
      :width="imageWidth"
      :height="imageHeight"
      :top="imageTop"
      :left="imageLeft"
      :showing="appStore.isShowing"
      :active="appStore.isActive"
    />
    <img
      ref="imageRef"
      class="image-viewer-overlay-img"
      :src
      :data-active="appStore.isShowing"
      :data-showing="appStore.isActive"
    />
  </ImageViewerContainer>
</template>

<style lang="scss" scoped>
.image-viewer-overlay-img {
  z-index: 2;
  max-width: 100%;
  max-height: 100%;

  display: flex;

  object-fit: cover;

  user-select: none;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  overflow: hidden;

  &[data-active='true'] {
    transition: all 700ms ease;
  }
}
</style>
