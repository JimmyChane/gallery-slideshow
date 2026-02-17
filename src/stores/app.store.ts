import { defineStore } from 'pinia';

import { useImageViewerOverlay } from './useImageViewerOverlay';

export const useAppStore = defineStore('app', () => {
  const imageViewerOverlay = useImageViewerOverlay();

  return { ...imageViewerOverlay };
});
