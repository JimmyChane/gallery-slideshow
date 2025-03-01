<script setup lang="ts">
import {
  type MaybeElement,
  useElementBounding,
  watchThrottled,
} from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref } from 'vue';

import type { ImageHolderModel } from '@/app.store';

const props = defineProps<{ model: ImageHolderModel; parentScorllX: number }>();

const selfRef = ref<MaybeElement>();

const { width, height, x, y } = useElementBounding(selfRef);

const style = computed<StyleValue>(() => {
  const style: StyleValue = {};

  const ratio = props.model.getBestAspectRatio();

  if (ratio !== undefined) {
    style['min-height'] = `calc(16em * ${ratio[1] / ratio[0]})`;
    // style.gridColumn = ratio[0];
    // style.gridRow = ratio[1];
    // style.aspectRatio = `${ratio[0]} / ${ratio[1]}`;
  }

  return style;
});

watchThrottled(
  [width, height, x, y],
  () => {
    props.model.width = width.value;
    props.model.height = height.value;
    props.model.x = x.value + props.parentScorllX;
    props.model.y = y.value;
  },
  { throttle: 200, leading: true, trailing: true },
);

onMounted(async () => {
  const content = await new Promise<string>((r) => {
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      r(event.target?.result as string);
    });
    reader.readAsDataURL(props.model.file);
  });

  props.model.src = content;
});
</script>

<template>
  <img
    ref="selfRef"
    :style="style"
    class="home-image-holder"
    :src="model.src"
  />
</template>

<style lang="scss" scoped>
.home-image-holder {
  width: 16rem;

  transition: all 400ms ease;

  flex-grow: 1;

  object-fit: cover;
  display: flex;
  overflow: hidden;

  opacity: 0;
  pointer-events: none;
  user-select: none;
}
</style>
