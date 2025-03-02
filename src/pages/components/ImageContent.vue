<script setup lang="ts">
import { type StyleValue, computed } from 'vue';

import type { ImageHolderModel } from '@/app.store';

const props = defineProps<{ model: ImageHolderModel }>();

const style = computed<StyleValue>(() => {
  return {
    width: `${props.model.width}px`,
    height: `${props.model.height}px`,
    left: `${props.model.x}px`,
    top: `${props.model.y}px`,
    transform: props.model.isHovering ? `scale(1.05)` : undefined,
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

  border-radius: 1em;
  background-color: rgba(255, 255, 255, 0.2);

  transition: all 400ms ease;
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
