<script setup lang="ts">
import { wait } from '@chanzor/utils';
import { useRafFn, useScroll, watchPausable } from '@vueuse/core';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';

import SlideshowHolder from './Slideshow-Holder.vue';
import SlideshowImage from './Slideshow-Image.vue';

const props = defineProps<{ models: ImageModel[] }>();

const selfRef = useTemplateRef<HTMLDivElement>('selfRef');
const speed = ref(0.2);

const { x } = useScroll(selfRef);

let offset = 0;

const { resume: resumeSlide, pause: pauseSlide } = useRafFn(
  () => {
    if (!selfRef.value) return;

    offset = offset + speed.value;

    if (offset >= selfRef.value.scrollWidth - selfRef.value.offsetWidth) {
      offset = 0;
    }

    x.value = offset;
  },
  { immediate: false },
);

const { resume: resumeWatchScroll, pause: pauseWatchScroll } = watchPausable(
  x,
  () => (offset = x.value),
);

const resumeSlideshow = () => {
  pauseWatchScroll();
  resumeSlide();
};
const pauseSlideshow = () => {
  pauseSlide();
  resumeWatchScroll();
};

watch(x, () => {
  for (const model of props.models) {
    model.holderPosition.screenX = model.holderPosition.x - x.value;
    model.holderPosition.screenY = model.holderPosition.y;
  }
});

onMounted(async () => {
  await wait(500);
  resumeSlideshow();
});
</script>

<template>
  <div
    ref="selfRef"
    class="images"
    @mouseleave="() => resumeSlideshow()"
    @mouseenter="() => pauseSlideshow()"
  >
    <div class="images-contents">
      <SlideshowHolder
        v-for="holder of models"
        :key="holder.id"
        style="z-index: 0"
        :model="holder"
      />

      <SlideshowImage
        v-for="holder of models"
        :key="holder.id"
        style="z-index: 1"
        :model="holder"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.images {
  width: 100%;
  height: 100%;

  overflow-y: hidden;
  overflow-x: auto;

  scrollbar-width: 0px;
  &::-webkit-scrollbar {
    display: none;
  }

  .images-contents {
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
