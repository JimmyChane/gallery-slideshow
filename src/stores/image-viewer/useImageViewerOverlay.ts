import { waitMs } from '@chanzor/utils';
import { waitFrameMs } from '@chanzor/vue-utils';
import { computed, ref } from 'vue';

import type { ImageModel } from '@/model/Image.model';

export type ImageViewerState = 'opening' | 'opened' | 'closing' | 'closed';

export function useImageViewerOverlay() {
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

  const startX = ref(-1);
  const startY = ref(-1);
  const startWidth = ref(-1);
  const startHeight = ref(-1);

  let time = 0;

  const open = async (image: ImageModel): Promise<void> => {
    const now = (time = Date.now());

    model.value = image;
    startX.value = model.value.holderPosition.screenX;
    startY.value = model.value.holderPosition.screenY;
    startWidth.value = model.value.holderPosition.width;
    startHeight.value = model.value.holderPosition.height;

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'opening';

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'opened';
  };

  const close = async (): Promise<void> => {
    const now = (time = Date.now());

    if (model.value) {
      startX.value = model.value.holderPosition.screenX;
      startY.value = model.value.holderPosition.screenY;
      startWidth.value = model.value.holderPosition.width;
      startHeight.value = model.value.holderPosition.height;
    }

    await waitFrameMs();
    if (now !== time) return;

    state.value = 'closing';

    await waitMs(700);
    await waitFrameMs();
    if (now !== time) return;

    state.value = 'closed';
    model.value = undefined;
  };

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
}
