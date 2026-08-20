import { ref } from 'vue';

import { ImageFileModel, type ImageModel } from '@/module/image/image.model';

const FILE_TYPES = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

function isDirectoryPickerSupported(): boolean {
  return 'showDirectoryPicker' in window;
}

export async function openImageFolder(): Promise<File[] | undefined> {
  if (!isDirectoryPickerSupported()) return;

  const folderHandle = await window
    // @ts-expect-error
    .showDirectoryPicker()
    .catch((e: Error) => e);
  if (folderHandle instanceof Error) {
    if (folderHandle.message.startsWith('AbortError')) return;

    console.error('Error accessing folder:', folderHandle);
    return;
  }

  const handlers: FileSystemFileHandle[] = [];
  for await (const handle of folderHandle.values()) {
    if (handle.kind !== 'file') continue;

    const filename = handle.name.toLowerCase();
    const isSupported = FILE_TYPES.some((ext) => filename.endsWith(ext));
    if (!isSupported) {
      console.error('Invalid image format!');
      return;
    }

    handlers.push(handle);
  }

  const filePromises = handlers.map((handle) => handle.getFile());
  const files = await Promise.all(filePromises);

  return files;
}

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
