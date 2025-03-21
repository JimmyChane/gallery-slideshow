<script setup lang="ts">
import {
  useDebounceFn,
  useElementHover,
  useResizeObserver,
  useThrottleFn,
} from '@vueuse/core';
import { onMounted, useTemplateRef, watch } from 'vue';

import { useAppStore } from '@/app.store';
import type { ImageHolderModel } from '@/model/ImageHolder.model';

const props = defineProps<{ model: ImageHolderModel }>();

const appStore = useAppStore();

const selfRef = useTemplateRef<HTMLButtonElement>('selfRef');

useResizeObserver(selfRef, () => invalidateBounding());

const invalidateBounding = () => {
  if (!selfRef.value) return;

  const width = selfRef.value.offsetWidth;
  const height = selfRef.value.offsetHeight;
  const x = selfRef.value.offsetLeft;
  const y = selfRef.value.offsetTop;

  setModelThrottle(width, height, x, y);
  setModelDebounce(width, height, x, y);
};
const setModelBounding = (
  width: number,
  height: number,
  x: number,
  y: number,
) => {
  props.model.width = width;
  props.model.height = height;
  props.model.x = x;
  props.model.y = y;
};
const setModelThrottle = useThrottleFn(setModelBounding, 500, true, true);
const setModelDebounce = useDebounceFn(setModelBounding, 600);

const isHovering = useElementHover(selfRef);

const openImage = () => {
  appStore.showImage(props.model);
  selfRef.value?.blur();
};

watch(isHovering, () => (props.model.isHovering = isHovering.value));

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
  <button ref="selfRef" class="image-holder" @click="openImage">
    <img :src="model.src" />
  </button>
</template>

<style lang="scss" scoped>
.image-holder {
  width: 12rem;

  flex-grow: 1;

  display: flex;
  overflow: hidden;

  opacity: 0;

  &:hover {
    transform: scale(1.05);
  }

  & > img {
    width: 100%;
    height: 100%;
  }
}
</style>
