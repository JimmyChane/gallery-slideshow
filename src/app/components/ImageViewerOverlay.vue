<script setup lang="ts">
import { type StyleValue, computed } from 'vue';

import { useAppStore } from '@/app.store';

const appStore = useAppStore();

const isShowing = computed(() => appStore.isShowingImage);

const width = computed(() => appStore.imageModel?.width ?? 0);
const height = computed(() => appStore.imageModel?.height ?? 0);

const style = computed<StyleValue>(() => {
  return {
    '--start-x': `${appStore.imageModel?.screenX}px`,
    '--start-y': `${appStore.imageModel?.screenY}px`,
    '--start-width': `${width.value}px`,
    '--start-height': `${height.value}px`,
  };
});
</script>

<template>
  <div
    class="image-viewer-overlay"
    :style="style"
    :data-showing="isShowing"
    @click.self="() => appStore.closeImage()"
  >
    <div
      class="image-viewer-overlay-content"
      @click.self="() => appStore.closeImage()"
    >
      <img :src="appStore.imageModel?.src" />
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

  transition: all 700ms ease;

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

    transition: all 700ms ease;

    & > img {
      max-width: 100%;
      max-height: 100%;
      overflow: hidden;

      display: flex;

      object-fit: cover;
      border-radius: 1rem;

      user-select: none;
      transition: all 700ms ease;
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
