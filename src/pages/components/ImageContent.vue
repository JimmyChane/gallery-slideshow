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

  // &:hover {
  //   transform: scale(1.05);
  // }

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
