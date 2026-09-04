import { type MaybeElement, useElementBounding, useElementSize } from '@vueuse/core';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useImageViewerRefStore = defineStore('image-viewer-ref', () => {
  const eleRef = ref<MaybeElement>();

  const { width: eleWidth, height: eleHeight } = useElementSize(eleRef);
  const { left: eleLeft, top: eleTop } = useElementBounding(eleRef);

  return { eleRef, eleWidth, eleHeight, eleLeft, eleTop };
});
