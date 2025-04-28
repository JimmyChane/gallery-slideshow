import { wait } from '@chanzor/utils';
import { waitFrame } from '@chanzor/vue-utils';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import type { ImageModel } from '~/src/model/Image.model';

export const useAppStore = defineStore('app', () => {
  const isShowingImage = ref(false);
  const imageModel = ref<ImageModel>();
  let time = 0;

  return {
    isShowingImage: computed(() => isShowingImage.value),
    imageModel: computed(() => imageModel.value),
    async showImage(image: ImageModel) {
      const now = (time = Date.now());

      imageModel.value = image;

      await waitFrame();
      if (now !== time) return;

      isShowingImage.value = true;
    },
    async closeImage() {
      const now = (time = Date.now());

      isShowingImage.value = false;
      await wait(700);
      await waitFrame();
      if (now !== time) return;

      imageModel.value = undefined;
    },
  };
});
