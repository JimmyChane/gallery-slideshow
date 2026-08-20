import { type MaybeUndefined, optArray } from '@chanzor/utils';
import { ref } from 'vue';

import { API_SERVER } from '@/api/api';
import type { ImagePathData } from '@/module/image/image.model';

async function getApiImgList(): Promise<ImagePathData[]> {
  const result = await API_SERVER.get<MaybeUndefined<ImagePathData[]>>('/api/img/list');
  return optArray(result.data);
}

export function useServerFilenames() {
  const filenames = ref<string[]>([]);
  const status = ref<'error' | 'idle' | 'pending' | 'success'>();
  const error = ref<Error>();

  async function fetchFilenames(): Promise<void> {
    const list = await getApiImgList();
    filenames.value = list.map((item) => item.filename).filter((filename) => typeof filename === 'string');
    status.value = 'success';
  }

  async function refresh(): Promise<void> {
    status.value = 'pending';
    await fetchFilenames().catch((e) => {
      error.value = e;
      status.value = 'error';
    });
  }

  return { filenames, status, error, refresh };
}
