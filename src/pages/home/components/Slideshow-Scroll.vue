<script setup lang="ts">
import { waitMs } from '@chanzor/utils';
import { useRafFn, useScroll, watchPausable } from '@vueuse/core';
import { onMounted, useTemplateRef, watch } from 'vue';

import type { ImageModel } from '@/module/image/image.model.ts';

import SlideshowHolder from './Slideshow-Holder.vue';
import SlideshowImage from './Slideshow-Image.vue';

const { models, speed } = defineProps<{ models: ImageModel[]; speed: number }>();

const selfRef = useTemplateRef<HTMLDivElement>('selfRef');

const { x } = useScroll(selfRef);

let offset = 0;

const {
  resume: resumeSlide,
  pause: pauseSlide,
  isActive,
} = useRafFn(
  () => {
    if (!selfRef.value) return;

    offset = offset + speed;

    if (offset >= selfRef.value.scrollWidth - selfRef.value.offsetWidth) {
      offset = 0;
    }

    x.value = offset;
  },
  { immediate: false },
);

const { resume: resumeWatchScroll, pause: pauseWatchScroll } = watchPausable(x, () => (offset = x.value));

function resume() {
  pauseWatchScroll();
  resumeSlide();
}

function pause() {
  pauseSlide();
  resumeWatchScroll();
}

function toggle() {
  isActive.value ? pause() : resume();
}

watch(x, () => {
  for (const model of models) {
    model.holderPosition.screenX = model.holderPosition.x - x.value;
    model.holderPosition.screenY = model.holderPosition.y;
  }
});

onMounted(async () => {
  await waitMs(500);
  resume();
});

defineExpose({ resume, pause, toggle, isActive });
</script>

<template>
  <div ref="selfRef" class="slideshow-scroll">
    <div class="slideshow-scroll-contents">
      <SlideshowHolder v-for="holder of models" :key="holder.id" style="z-index: 0" :model="holder" />

      <SlideshowImage v-for="holder of models" :key="holder.id" style="z-index: 1" :model="holder" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.slideshow-scroll {
  width: 100%;
  height: 100%;

  overflow-y: hidden;
  overflow-x: auto;

  scrollbar-width: 0px;
  &::-webkit-scrollbar {
    display: none;
  }

  .slideshow-scroll-contents {
    position: relative;

    width: max-content;
    height: 100%;

    gap: 1em;
    padding: 1em;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
  }
}
</style>
