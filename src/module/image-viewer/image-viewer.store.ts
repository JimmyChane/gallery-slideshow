import { waitFrameMs } from '@chanzor/vue-utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ImageModel } from '../image/image.model';
import { useImageViewerPositionStore } from './image-viewer-position.store';

export type ImageViewerState = 'opening' | 'opened' | 'closing' | 'closed';

export const useImageViewerStore = defineStore('image-viewer', () => {
  const state = ref<ImageViewerState>('closed');
  const isActive = computed(() => {
    switch (state.value) {
      case 'opening':
      case 'opened':
      case 'closing':
        return true;
      default:
        return false;
    }
  });
  const isShowing = computed(() => {
    switch (state.value) {
      case 'opening':
      case 'opened':
        return true;
      default:
        return false;
    }
  });

  const model = ref<ImageModel>();

  let time = 0;

  async function open(image: ImageModel): Promise<void> {
    const now = (time = Date.now());

    model.value = image;
    useImageViewerPositionStore().setPositionByModel(model.value);

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'opening';

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'opened';
  }

  async function close(): Promise<void> {
    const now = (time = Date.now());

    if (model.value) useImageViewerPositionStore().setPositionByModel(model.value);

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'closing';

    await waitFrameMs(700);
    if (now !== time) return;

    state.value = 'closed';
    model.value = undefined;
  }

  return { state: computed(() => state.value), isActive, isShowing, model: computed(() => model.value), open, close };
});
