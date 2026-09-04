<script setup lang="ts">
import { useImageViewerRefStore } from '../image-viewer-ref.store';
import { useImageViewerStore } from '../image-viewer.store';

const imageViewerStore = useImageViewerStore();
const imageViewerRefStore = useImageViewerRefStore();
</script>

<template>
  <div
    class="image-viewer-overlay-background"
    :style="{
      '--width': `${imageViewerRefStore.eleWidth}px`,
      '--height': `${imageViewerRefStore.eleHeight}px`,
      '--left': `calc(${imageViewerRefStore.eleLeft}px) - 1rem`,
      '--top': `calc(${imageViewerRefStore.eleTop}px - 1rem)`,
    }"
    :data-showing="imageViewerStore.isShowing"
    :data-active="imageViewerStore.isActive"
  ></div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay-background {
  z-index: 1;
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--width);
  height: var(--height);

  user-select: none;
  pointer-events: none;

  display: flex;
  background-color: rgba(0, 0, 0, 0.66);
  border-radius: 1rem;
  overflow: hidden;

  &[data-active='true'] {
    transition: all 700ms ease;
  }
  &[data-showing='true'] {
    opacity: 1;
  }
}
</style>
