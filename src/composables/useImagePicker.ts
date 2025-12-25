import { ref } from 'vue';

import { openImageFolder } from '@/api/openImageFolder.api';

import { ImageModel } from '../model/Image.model';
import { ImageFileModel } from '../model/ImageFile.model';

export function useImagePicker() {
  const isOpened = ref(false);

  const models = ref<ImageModel[]>([]);
  const randomSort = [-1, 0, 1] as const;

  const openFolder = async (): Promise<void> => {
    if (isOpened.value) return;

    const files = await openImageFolder();
    if (!files) return;

    models.value = files.map((file) => new ImageFileModel(file));
    models.value.sort(() => {
      const randomIndex = Math.round(Math.random() * 3);
      return randomSort[randomIndex] as (typeof randomSort)[number];
    });

    isOpened.value = true;
  };

  return { isOpened, models, openFolder };
}
