<script setup lang="ts">
import { storeToRefs } from '#imports';
import { computedAsync, debouncedRef, useWindowSize } from '@vueuse/core';
import { type StyleValue, computed } from 'vue';

import { useAppStore } from '~/src/stores/app.store';

const appStore = useAppStore();
const { isActive, isShowing, model, startX, startY, startWidth, startHeight } =
  storeToRefs(appStore);

const windowSize = useWindowSize();
const debouncedWindowWidth = debouncedRef(windowSize.width, 1000);
const debouncedWindowHeight = debouncedRef(windowSize.height, 1000);

const src = computedAsync(() => {
  if (debouncedWindowWidth.value > debouncedWindowHeight.value) {
    return model.value?.getSrc(debouncedWindowHeight.value, undefined);
  } else if (debouncedWindowWidth.value < debouncedWindowHeight.value) {
    return model.value?.getSrc(undefined, debouncedWindowWidth.value);
  } else {
    return model.value?.getSrc(
      debouncedWindowWidth.value,
      debouncedWindowHeight.value,
    );
  }
});

const style = computed<StyleValue>(() => {
  return {
    '--start-x': `${startX.value}px`,
    '--start-y': `${startY.value}px`,
    '--start-width': `${startWidth.value}px`,
    '--start-height': `${startHeight.value}px`,
  };
});
</script>

<template>
  <div
    class="image-viewer-overlay"
    :style="style"
    :data-active="isActive"
    :data-showing="isShowing"
    @click.self="() => appStore.close()"
  >
    <div
      class="image-viewer-overlay-content"
      @click.self="() => appStore.close()"
    >
      <img :src="src" />
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

  .image-viewer-overlay-content {
    top: var(--start-y);
    left: var(--start-x);
    width: var(--start-width);
    height: var(--start-height);

    position: absolute;
    opacity: 0;
    display: grid;
    place-items: center;

    & > img {
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;

      display: flex;

      object-fit: cover;
      border-radius: 1rem;

      user-select: none;
    }
  }

  &[data-active='true'] {
    transition: all 700ms ease;
    .image-viewer-overlay-content {
      transition: all 700ms ease;
      & > img {
        transition: all 700ms ease;
      }
    }
  }
  &[data-showing='true'] {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 5rem black;

    pointer-events: unset;
    user-select: unset;

    .image-viewer-overlay-content {
      top: 1rem;
      left: 1rem;
      width: calc(100% - 2rem);
      height: calc(100% - 2rem);

      opacity: 1;
    }
  }
}
</style>
