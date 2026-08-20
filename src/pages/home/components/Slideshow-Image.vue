<script setup lang="ts">
import { waitMs } from '@chanzor/utils';
import { computedAsync, useElementVisibility, useThrottle } from '@vueuse/core';
import { type StyleValue, computed, onMounted, ref, useTemplateRef, watch } from 'vue';

import { useImageViewerStore } from '@/module/image-viewer/image-viewer.store';
import type { ColorPaletteData } from '@/module/image/image-color-palette.model';
import { ImageBlobModel, ImageModel, ImagePathModel } from '@/module/image/image.model';

const { model } = defineProps<{ model: ImageModel }>();

const appStore = useImageViewerStore();

const selfRef = useTemplateRef('selfRef');
const isVisible = useElementVisibility(selfRef);
const isVisibleDelay = useThrottle(isVisible, 500, true, true);

const isTriggeredLoad = ref(false);
const isHovering = computedAsync(async () => {
  if (!model.isHovering) await waitMs(200);
  return model.isHovering;
}, false);

const src = ref<string>();
const colorPalette = ref<ColorPaletteData>();

const opacity = computedAsync(async () => {
  if (!model.isPositionReady) return 0;
  if (appStore.model === model) {
    await waitMs(500);
    return 0;
  }
  return 1;
}, 0);

const style = computed<StyleValue>(() => {
  return {
    opacity: opacity.value,
    left: `${model.holderPosition.x}px`,
    top: `${model.holderPosition.y}px`,
    width: `${model.holderPosition.width}px`,
    height: `${model.holderPosition.height}px`,
    '--color-muted': `${colorPalette.value?.muted ?? 'rgba(255, 255, 255, 0.2)'}`,
    '--color-muted-dark': `${colorPalette.value?.mutedDark ?? 'rgba(255, 255, 255, 0.2)'}`,
    '--color-muted-light': `${colorPalette.value?.mutedLight ?? 'rgba(255, 255, 255, 0.2)'}`,
    '--color-vibrant': `${colorPalette.value?.vibrant ?? 'rgba(255, 255, 255, 0.2)'}`,
    '--color-vibrant-dark': `${colorPalette.value?.vibrantDark ?? 'rgba(255, 255, 255, 0.2)'}`,
    '--color-vibrant-light': `${colorPalette.value?.vibrantLight ?? 'rgba(255, 255, 255, 0.2)'}`,
  };
});

async function onTriggerLoad() {
  if (isTriggeredLoad.value) return;
  if (!isVisible.value) return;
  isTriggeredLoad.value = true;
  src.value = await model.getSrc(350, undefined);

  if (model instanceof ImagePathModel || model instanceof ImageBlobModel) {
    colorPalette.value = await model.colorPalette.getColorPalette();
  }
}

watch(isVisibleDelay, () => onTriggerLoad());

onMounted(() => onTriggerLoad());
</script>

<template>
  <div ref="selfRef" class="home-image-content" :style="style" :data-hovering="isHovering">
    <img v-if="src?.length" :src="src" />
  </div>
</template>

<style lang="scss" scoped>
.home-image-content {
  position: absolute;

  border-radius: 1rem;
  background-color: var(--color-muted);

  transition: all 200ms ease-in-out;
  overflow: hidden;

  pointer-events: none;
  user-select: none;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: all 300ms ease;
  }

  &[data-hovering='true'] {
    & > img {
      transform: scale(1.2);
    }
  }
}
</style>
