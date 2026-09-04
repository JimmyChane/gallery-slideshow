<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { useTemplateRef, watch } from 'vue';

import { useImageViewerStore } from '@/module/image-viewer/image-viewer.store.ts';

import { useImageViewerRefStore } from './image-viewer-ref.store.ts';

import ImageViewerBackground from './components/ImageViewer-Background.vue';
import ImageViewerContainer from './components/ImageViewer-Container.vue';
import ImageViewerImage from './components/ImageViewer-Image.vue';

const imageViewerStore = useImageViewerStore();
const imageViewerRefStore = useImageViewerRefStore();

const imageRef = useTemplateRef('imageRef');
onClickOutside(imageRef, () => {
  if (imageViewerStore.isShowing) imageViewerStore.close();
});

watch(imageRef, () => (imageViewerRefStore.eleRef = imageRef.value), { immediate: true });
</script>

<template>
  <ImageViewerContainer>
    <ImageViewerBackground />
    <ImageViewerImage ref="imageRef" />
  </ImageViewerContainer>
</template>
