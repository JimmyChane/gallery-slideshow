<script setup lang="ts">
import { wait } from '@chanzor/utils';
import { computedAsync } from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';
import { useAppStore } from '~/src/stores/app.store';

const props = defineProps<{ model: ImageModel }>();

const hovering = computedAsync(async () => {
  if (!props.model.isHovering) {
    await wait(200);
  }

  return props.model.isHovering;
}, false);

const appStore = useAppStore();
const src = ref<string>();

const opacity = computedAsync(async () => {
  if (appStore.model === props.model) {
    await wait(500);
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
    transition: all 700ms ease-in-out;
  }

  &[data-hovering='true'] {
    & > img {
      transform: scale(1.2);
    }
  }
}
</style>
