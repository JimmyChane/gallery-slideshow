<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
import { computed, useTemplateRef, watch } from 'vue';

import { useImageViewerStore } from '@/module/image-viewer/image-viewer.store.ts';

import { ImageBlobModel, ImagePathModel, getApiImgDownload } from '../image/image.model.ts';
import { useImageViewerPositionStore } from './image-viewer-position.store.ts';
import { useImageViewerRefStore } from './image-viewer-ref.store.ts';

import CloseIcon from '@/components/icon/Close.icon.vue';
import DownloadIcon from '@/components/icon/Download.icon.vue';

import ImageViewerBackground from './components/ImageViewer-Background.vue';
import ImageViewerImage from './components/ImageViewer-Image.vue';

const FEATURE_DOWNLOAD = true;

const imageViewerStore = useImageViewerStore();
const imageViewerRefStore = useImageViewerRefStore();
const imageViewerPositionStore = useImageViewerPositionStore();

const imageRef = useTemplateRef('imageRef');
const actionbarRef = useTemplateRef('actionbarRef');

onClickOutside(
  imageRef,
  () => {
    if (imageViewerStore.isShowing) imageViewerStore.close();
  },
  { ignore: [actionbarRef] },
);

watch(imageRef, () => (imageViewerRefStore.eleRef = imageRef.value), { immediate: true });

const isDownloadable = computed(() => {
  return (
    (imageViewerStore.model instanceof ImageBlobModel && imageViewerStore.model.type === 'blob') ||
    (imageViewerStore.model instanceof ImagePathModel && imageViewerStore.model.type === 'path')
  );
});
</script>

<template>
  <div
    class="image-viewer-overlay"
    :style="{
      '--left': `${imageViewerPositionStore.x}px`,
      '--top': `${imageViewerPositionStore.y}px`,
      '--width': `${imageViewerPositionStore.width}px`,
      '--height': `${imageViewerPositionStore.height}px`,
    }"
    :data-active="imageViewerStore.isActive"
    :data-showing="imageViewerStore.isShowing"
  >
    <div class="image-viewer-overlay-body">
      <div ref="actionbarRef" class="image-viewer-overlay-actionbar">
        <div class="actionbar-group left">
          <button type="button" aria-label="Close viewer" title="Close" @click="() => imageViewerStore.close()">
            <CloseIcon />
          </button>
        </div>

        <div v-if="FEATURE_DOWNLOAD && isDownloadable" class="actionbar-group right">
          <button
            type="button"
            aria-label="Download image"
            title="Download"
            @click="
              () => {
                if (
                  (imageViewerStore.model instanceof ImageBlobModel && imageViewerStore.model.type === 'blob') ||
                  (imageViewerStore.model instanceof ImagePathModel && imageViewerStore.model.type === 'path')
                ) {
                  getApiImgDownload(imageViewerStore.model.filename);
                }
              }
            "
          >
            <DownloadIcon />
          </button>
        </div>
      </div>

      <div class="image-viewer-overlay-content">
        <ImageViewerBackground />
        <ImageViewerImage ref="imageRef" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay {
  --actionbar-height: 3.5rem;

  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100dvh;

  display: flex;
  flex-direction: column;

  background-color: rgba(0, 0, 0, 0);
  box-shadow: 0 0 5rem transparent;

  pointer-events: none;
  user-select: none;

  .image-viewer-overlay-actionbar {
    height: var(--actionbar-height);
    width: 100%;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
    box-sizing: border-box;
    z-index: 10;

    opacity: 0;
    transform: translateY(-0.5rem);
    transition:
      opacity 300ms ease,
      transform 300ms ease;

    .actionbar-group {
      display: flex;
      flex-direction: row;
      align-items: center;
      gap: 0.75rem;

      & > * {
        font-size: 1.15rem;
      }
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;

      width: 2.5rem;
      height: 2.5rem;
      padding: 0;

      background-color: rgba(0, 0, 0, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      color: #ffffff;

      cursor: pointer;
      transition:
        background-color 0.2s ease,
        transform 0.15s ease,
        border-color 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.3);
      }

      &:active {
        transform: scale(0.92);
      }

      svg {
        display: block;
      }
    }
  }

  .image-viewer-overlay-body {
    position: relative;

    width: 100%;
    height: 100dvh;

    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;

    .image-viewer-overlay-content {
      top: var(--top);
      left: var(--left);

      position: absolute;
      opacity: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  }

  &[data-active='true'] {
    transition:
      background-color 700ms ease,
      box-shadow 700ms ease;

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        transition: all 700ms ease;
      }
    }
  }

  &[data-showing='true'] {
    background-color: rgba(0, 0, 0, 0.85);
    box-shadow: 0 0 5rem black;

    pointer-events: unset;
    user-select: unset;

    .image-viewer-overlay-actionbar {
      opacity: 1;
      transform: translateY(0);
    }

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        top: 1rem;
        left: 1rem;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);

        opacity: 1;
      }
    }
  }
}
</style>
