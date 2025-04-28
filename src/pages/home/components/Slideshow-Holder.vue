<script setup lang="ts">
import {
  useDebounceFn,
  useElementHover,
  useResizeObserver,
  useThrottleFn,
} from '@vueuse/core';
import { onMounted, ref, useTemplateRef, watch } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';
import { useAppStore } from '~/src/stores/app.store';

const props = defineProps<{ model: ImageModel }>();

const appStore = useAppStore();

const selfRef = useTemplateRef('selfRef');

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
const src = ref<string>();

const openImage = () => {
  appStore.showImage(props.model);
  selfRef.value?.blur();
};

watch(isHovering, () => (props.model.isHovering = isHovering.value));

onMounted(async () => {
  src.value = await props.model.getSrc();
});
</script>

<template>
  <button ref="selfRef" class="image-holder" @click="openImage">
    <img :src="src" />
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
