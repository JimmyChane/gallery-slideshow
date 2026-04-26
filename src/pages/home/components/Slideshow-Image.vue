<script setup lang="ts">
import { waitMs } from '@chanzor/utils';
import { computedAsync } from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref } from 'vue';

import type { ImageModel } from '@/model/Image.model';
import { useImageViewerStore } from '@/stores/image-viewer/image-viewer.store';

const { model } = defineProps<{ model: ImageModel }>();

const hovering = computedAsync(async () => {
  if (!model.isHovering) {
    await waitMs(200);
  }

  return model.isHovering;
}, false);

const appStore = useImageViewerStore();
const src = ref<string>();

const opacity = computedAsync(async () => {
  if (!model.isPositionReady) return 0;

  if (appStore.model === model) {
    await waitMs(500);
    return 0;
  }

  return 1;
}, 0);

const style = computed<StyleValue>(() => {
  return {
    opacity: opacity.value,
    left: `${model.holderPosition.x}px`,
    top: `${model.holderPosition.y}px`,
    width: `${model.holderPosition.width}px`,
    height: `${model.holderPosition.height}px`,
  };
});

onMounted(async () => {
  src.value = await model.getSrc(350, undefined);
});
</script>

<template>
  <div class="home-image-content" :style="style" :data-hovering="hovering">
    <img v-if="src?.length" :src="src" />
  </div>
</template>

<style lang="scss" scoped>
.home-image-content {
  position: absolute;

  border-radius: 1rem;
  background-color: rgba(255, 255, 255, 0.2);

  transition: all 200ms ease-in-out;
  overflow: hidden;

  pointer-events: none;
  user-select: none;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 300ms ease;
  }

  &[data-hovering='true'] {
    & > img {
      transform: scale(1.2);
    }
  }
}
</style>
