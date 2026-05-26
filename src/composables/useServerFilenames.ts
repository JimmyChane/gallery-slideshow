import { ref } from 'vue';

import { getApiImgList } from '@/module/image/img.api';

export function useServerFilenames() {
  const filenames = ref<string[]>([]);
  const status = ref<'error' | 'idle' | 'pending' | 'success'>();
  const error = ref<Error>();

  async function fetchFilenames(): Promise<void> {
    const list = await getApiImgList();
    filenames.value = list
      .map((item) => item.filename)
      .filter((filename) => typeof filename === 'string');
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
