import { ref } from 'vue';

import { openImageFolder } from '../api/OpenFile.api';
import { ImageModel } from '../model/Image.model';
import { ImageFileModel } from '../model/ImageFile.model';

export function useImagePicker() {
  const isOpened = ref(false);

  const models = ref<ImageModel[]>([]);

  const openFolder = async (): Promise<void> => {
    if (isOpened.value) return;

    const files = await openImageFolder();
    if (!files) return;

    models.value = files.map((file) => new ImageFileModel(file));
    models.value.sort(() => [-1, 0, 1][Math.round(Math.random() * 3)]);

    isOpened.value = true;
  };

  return { isOpened, models, openFolder };
}
