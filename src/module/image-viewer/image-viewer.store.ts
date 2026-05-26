import { defineStore } from 'pinia';

import { useImageViewerOverlay } from './useImageViewerOverlay';

export const useImageViewerStore = defineStore('app', () => {
  const imageViewerOverlay = useImageViewerOverlay();

  return { ...imageViewerOverlay };
});
