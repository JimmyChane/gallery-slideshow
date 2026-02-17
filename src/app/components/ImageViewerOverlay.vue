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

const appStore = useAppStore();

const windowSize = useWindowSize();
const debouncedWindowWidth = debouncedRef(windowSize.width, 1000);
const debouncedWindowHeight = debouncedRef(windowSize.height, 1000);

const src = computedAsync<string | undefined>(() => {
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
  <div
    class="image-viewer-overlay"
    :style="{
      '--start-x': `${appStore.startX}px`,
      '--start-y': `${appStore.startY}px`,
      '--start-width': `${appStore.startWidth}px`,
      '--start-height': `${appStore.startHeight}px`,
    }"
    :data-active="appStore.isActive"
    :data-showing="appStore.isShowing"
  >
    <div class="image-viewer-overlay-body">
      <div class="image-viewer-overlay-content">
        <div
          class="image-viewer-overlay-background"
          :style="{
            '--width': `${imageWidth}px`,
            '--height': `${imageHeight}px`,
            '--left': `calc(${imageLeft}px) - 1rem`,
            '--top': `calc(${imageTop}px - 1rem)`,
          }"
        ></div>
        <img ref="imageRef" class="image-viewer-overlay-img" :src />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay {
  position: fixed;

  width: 100%;
  height: 100dvh;

  display: grid;
  place-items: center;

  background-color: rgba(0, 0, 0, 0);
  box-shadow: 0 0 5rem transparent;

  pointer-events: none;
  user-select: none;

  .image-viewer-overlay-body {
    position: relative;

    width: 100%;
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .image-viewer-overlay-content {
      top: var(--start-y);
      left: var(--start-x);
      width: var(--start-width);
      height: var(--start-height);

      position: absolute;
      opacity: 0;
      display: grid;
      place-items: center;

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
      }

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
      }
    }
  }

  &[data-active='true'] {
    transition: all 700ms ease;

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        transition: all 700ms ease;
        .image-viewer-overlay-background {
          transition: all 700ms ease;
        }
        .image-viewer-overlay-img {
          transition: all 700ms ease;
        }
      }
    }
  }
  &[data-showing='true'] {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 5rem black;

    pointer-events: unset;
    user-select: unset;

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        top: 1rem;
        left: 1rem;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);

        opacity: 1;

        .image-viewer-overlay-background {
          opacity: 1;
        }
      }
    }
  }
}
</style>
