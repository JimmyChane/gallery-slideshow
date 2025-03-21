import { wait } from '@chanzor/utils';
import { waitFrame } from '@chanzor/vue-utils';
import { defineStore } from 'pinia';
import { type Component, computed, ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';

import type { ImageHolderModel } from './model/ImageHolder.model';

export interface AppRouteOption {
  readonly path: string;
  readonly title: string;
  readonly icon?: Component;

  readonly page: () => Component;
}
export class AppRoute {
  readonly id: string;
  readonly path: string;
  readonly title: string;
  readonly icon?: Component;

  readonly page: () => Component;

  constructor(id: string, option: AppRouteOption) {
    this.id = id;
    this.path = option.path;
    this.title = option.title;
    this.icon = option.icon;

    this.page = option.page;
  }

  toVueRoute(): RouteRecordRaw {
    return { name: this.id, path: this.path, component: this.page };
  }
}

export const useAppStore = defineStore('app', () => {
  const isShowingImage = ref(false);
  const imageModel = ref<ImageHolderModel>();
  let time = 0;

  return {
    isShowingImage: computed(() => isShowingImage.value),
    imageModel: computed(() => imageModel.value),
    async showImage(image: ImageHolderModel) {
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
