<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { ImageModel } from '@/module/image/image.model.ts';

import { useHoldAction } from './useHoldAction';
import { useSlideshowSpeed } from './useSlideshowSpeed';

import FastForwardIcon from '@/components/Fast-Forward.icon.vue';
import PauseIcon from '@/components/Pause.icon.vue';
import PlayIcon from '@/components/Play.icon.vue';
import RewindIcon from '@/components/Rewind.icon.vue';

import SlideshowButton from './Slideshow-Button.vue';
import SlideshowScroll from './Slideshow-Scroll.vue';

const props = defineProps<{ models: ImageModel[] }>();

const slideshowRef = useTemplateRef('slideshowRef');

const { speed, increaseSpeed, decreaseSpeed } = useSlideshowSpeed();

const { start: startIncreaseSpeed, stop: stopIncreaseSpeed } = useHoldAction(
  () => increaseSpeed(),
);
const { start: startDecreaseSpeed, stop: stopDecreaseSpeed } = useHoldAction(
  () => decreaseSpeed(),
);
</script>

<template>
  <div class="slideshow">
    <SlideshowScroll ref="slideshowRef" :models :speed />

    <div class="slideshow-buttons">
      <span>Speed: {{ speed }}</span>

      <SlideshowButton
        @mousedown="startDecreaseSpeed"
        @mouseup="stopDecreaseSpeed"
        @mouseleave="stopDecreaseSpeed"
      >
        <RewindIcon />
      </SlideshowButton>

      <SlideshowButton
        :shape="slideshowRef?.isActive ? 'square' : 'circle'"
        @click="() => slideshowRef?.toggle()"
      >
        <PauseIcon v-if="slideshowRef?.isActive" />
        <PlayIcon v-else />
      </SlideshowButton>

      <SlideshowButton
        @mousedown="startIncreaseSpeed"
        @mouseup="stopIncreaseSpeed"
        @mouseleave="stopIncreaseSpeed"
      >
        <FastForwardIcon />
      </SlideshowButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slideshow {
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  overflow: hidden;

  .slideshow-buttons {
    --padding: 1rem;
    gap: 1rem;

    z-index: 2;

    position: absolute;
    bottom: var(--padding);
    right: var(--padding);

    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
</style>
