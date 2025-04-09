<script setup lang="ts">
import { wait } from '@chanzor/utils';
import { computedAsync } from '@vueuse/core';
import { type StyleValue, computed } from 'vue';

import type { ImageHolderModel } from '~/src/model/ImageHolder.model';
import { useAppStore } from '~/src/stores/app.store';

const props = defineProps<{ model: ImageHolderModel }>();

const appStore = useAppStore();

const opacity = computedAsync(async () => {
  if (appStore.imageModel === props.model) {
    await wait(500);
    return 0;
  }

  return 1;
}, 1);

const style = computed<StyleValue>(() => {
  return {
    opacity: opacity.value,
    left: `${props.model.x}px`,
    top: `${props.model.y}px`,
    width: `${props.model.width}px`,
    height: `${props.model.height}px`,
    transform: props.model.isHovering ? `scale(1.02)` : undefined,
  };
});
</script>

<template>
  <div class="home-image-content" :style="style">
    <img v-if="model.src.length" :src="model.src" />
  </div>
</template>

<style lang="scss" scoped>
.home-image-content {
  position: absolute;

  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.2);

  transition: all 400ms ease-in-out;
  overflow: hidden;

  pointer-events: none;
  user-select: none;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
