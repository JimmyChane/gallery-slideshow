<script setup lang="ts">
import { useTemplateRef } from 'vue';

import type { ImageModel } from '@/model/Image.model';

import PauseIcon from '@/components/Pause.icon.vue';
import PlayIcon from '@/components/Play.icon.vue';

import SlideshowButton from './Slideshow-Button.vue';
import SlideshowScroll from './Slideshow-Scroll.vue';

const props = defineProps<{ models: ImageModel[] }>();

const slideshowRef = useTemplateRef('slideshowRef');

// TODO: add speedup button
</script>

<template>
  <div class="slideshow">
    <SlideshowScroll ref="slideshowRef" :models />

    <div class="slideshow-buttons">
      <SlideshowButton
        :shape="slideshowRef?.isActive ? 'square' : 'circle'"
        @click="() => slideshowRef?.toggle()"
      >
        <PauseIcon v-if="slideshowRef?.isActive" />
        <PlayIcon v-else />
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
