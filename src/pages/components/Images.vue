<script setup lang="ts">
import { useRafFn, useScroll, watchPausable } from '@vueuse/core';
import { onMounted, ref } from 'vue';

import { ImageHolderModel } from '@/app.store';

import ImageContent from './ImageContent.vue';
import ImageHolder from './ImageHolder.vue';

defineProps<{ models: ImageHolderModel[] }>();

const selfRef = ref<HTMLDivElement>();
const speed = ref(0.7);

const { x } = useScroll(selfRef);

let offset = 0;

const { resume: resumeSlide, pause: pauseSlide } = useRafFn(() => {
  if (!selfRef.value) return;

  offset = offset + speed.value;

  if (offset >= selfRef.value.scrollWidth - selfRef.value.offsetWidth) {
    offset = 0;
  }

  x.value = offset;
});

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

onMounted(() => {
  // resumeSlideshow();
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
      <ImageHolder
        v-for="holder of models"
        :key="holder.file.name"
        style="z-index: 0"
        :model="holder"
      />

      <ImageContent
        v-for="holder of models"
        :key="holder.file.name"
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

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: 0px;

  .images-contents {
    position: relative;

    width: max-content;
    height: 100%;
    // margin-inline: auto;

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
