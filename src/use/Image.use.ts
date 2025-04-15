import { ref } from 'vue';

import { openImageFolder } from '../api/OpenFile.api';
import { ImageHolderModel } from '../model/ImageHolder.model';

export function useImagePicker() {
  const isOpened = ref(false);

  const models = ref<ImageHolderModel[]>([]);

  const openFolder = async (): Promise<void> => {
    if (isOpened.value) return;

    const files = await openImageFolder();
    if (!files) return;

    models.value = files.map((file) => new ImageHolderModel(file));
    models.value.sort(() => [-1, 0, 1][Math.round(Math.random() * 3)]);

    isOpened.value = true;
  };

  return { isOpened, models, openFolder };
}
