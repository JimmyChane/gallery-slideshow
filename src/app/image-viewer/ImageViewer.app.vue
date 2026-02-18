<script setup lang="ts">
import {
  onClickOutside,
  useElementBounding,
  useElementSize,
} from '@vueuse/core';
import { useTemplateRef } from 'vue';

import { useImageViewerStore } from '@/stores/image-viewer/image-viewer.store';

import ImageViewerBackground from './components/ImageViewer-Background.vue';
import ImageViewerContainer from './components/ImageViewer-Container.vue';
import ImageViewerImage from './components/ImageViewer-Image.vue';

const appStore = useImageViewerStore();

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
    <ImageViewerImage
      ref="imageRef"
      :model="appStore.model"
      :showing="appStore.isShowing"
      :active="appStore.isActive"
    />
  </ImageViewerContainer>
</template>
