<script setup lang="ts">
import { wait } from '@chanzor/utils';
import { computedAsync } from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';
import { useAppStore } from '~/src/stores/app.store';

const props = defineProps<{ model: ImageModel }>();

const appStore = useAppStore();
const src = ref<string>();

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

onMounted(async () => {
  src.value = await props.model.getSrc();
});
</script>

<template>
  <div class="home-image-content" :style="style">
    <img v-if="src?.length" :src="src" />
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
