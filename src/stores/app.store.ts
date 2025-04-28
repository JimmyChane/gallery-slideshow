import { wait } from '@chanzor/utils';
import { waitFrame } from '@chanzor/vue-utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';

export enum ImageViewerState {
  OPENING,
  OPENED,
  CLOSING,
  CLOSED,
}

export const useAppStore = defineStore('app', () => {
  const state = ref<ImageViewerState>(ImageViewerState.CLOSED);
  const isActive = computed(() => {
    switch (state.value) {
      case ImageViewerState.OPENING:
      case ImageViewerState.OPENED:
      case ImageViewerState.CLOSING:
        return true;
      default:
        return false;
    }
  });
  const isShowing = computed(() => {
    switch (state.value) {
      case ImageViewerState.OPENING:
      case ImageViewerState.OPENED:
        return true;
      default:
        return false;
    }
  });

  const model = ref<ImageModel>();

  const startX = ref(-1);
  const startY = ref(-1);
  const startWidth = ref(-1);
  const startHeight = ref(-1);

  let time = 0;

  async function open(image: ImageModel) {
    const now = (time = Date.now());

    model.value = image;
    startX.value = model.value.holderPosition.screenX;
    startY.value = model.value.holderPosition.screenY;
    startWidth.value = model.value.holderPosition.width;
    startHeight.value = model.value.holderPosition.height;

    await waitFrame();
    if (now !== time) return;

    state.value = ImageViewerState.OPENING;

    await waitFrame();
    if (now !== time) return;

    state.value = ImageViewerState.OPENED;
  }

  async function close() {
    const now = (time = Date.now());

    if (model.value) {
      startX.value = model.value.holderPosition.screenX;
      startY.value = model.value.holderPosition.screenY;
      startWidth.value = model.value.holderPosition.width;
      startHeight.value = model.value.holderPosition.height;
    }

    await waitFrame();
    if (now !== time) return;

    state.value = ImageViewerState.CLOSING;

    await wait(700);
    await waitFrame();
    if (now !== time) return;

    state.value = ImageViewerState.CLOSED;
    model.value = undefined;
  }

  return {
    state: computed(() => state.value),
    isActive,
    isShowing,

    model: computed(() => model.value),

    startX: computed(() => startX.value),
    startY: computed(() => startY.value),
    startWidth: computed(() => startWidth.value),
    startHeight: computed(() => startHeight.value),

    open,
    close,
  };
});
