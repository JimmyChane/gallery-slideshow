import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ImageModel } from '../image/image.model';

export type ImageViewerState = 'opening' | 'opened' | 'closing' | 'closed';

export const useImageViewerPositionStore = defineStore('image-viewer-position', () => {
  const x = ref(-1);
  const y = ref(-1);
  const width = ref(-1);
  const height = ref(-1);

  function setPositionByModel(model: ImageModel): void {
    x.value = model.holderPosition.screenX;
    y.value = model.holderPosition.screenY;
    width.value = model.holderPosition.width;
    height.value = model.holderPosition.height;
  }

  return {
    x: computed(() => x.value),
    y: computed(() => y.value),
    width: computed(() => width.value),
    height: computed(() => height.value),

    setPositionByModel,
  };
});
