<script setup lang="ts">
import { waitMs } from '@chanzor/utils';
import { computedAsync } from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref } from 'vue';

import type { ImageModel } from '@/model/Image.model';
import { useImageViewerStore } from '@/stores/image-viewer/image-viewer.store';

const props = defineProps<{ model: ImageModel }>();

const hovering = computedAsync(async () => {
  if (!props.model.isHovering) {
    await waitMs(200);
  }

  return props.model.isHovering;
}, false);

const appStore = useImageViewerStore();
const src = ref<string>();

const opacity = computedAsync(async () => {
  if (!props.model.isPositionReady) return 0;

  if (appStore.model === props.model) {
    await waitMs(500);
    return 0;
  }

  return 1;
}, 0);

const style = computed<StyleValue>(() => {
  return {
    opacity: opacity.value,
    left: `${props.model.holderPosition.x}px`,
    top: `${props.model.holderPosition.y}px`,
    width: `${props.model.holderPosition.width}px`,
    height: `${props.model.holderPosition.height}px`,
  };
});

onMounted(async () => {
  src.value = await props.model.getSrc(350, undefined);
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
    transition: all 400ms ease-in-out;
  }

  &[data-hovering='true'] {
    & > img {
      transform: scale(1.2);
    }
  }
}
</style>
