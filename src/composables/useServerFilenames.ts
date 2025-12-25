import { type MaybeUndefined, optArrayString } from '@chanzor/utils';
import { ref } from 'vue';

import { API } from '@/api/api';
import { ENV_ACCESS_TOKEN, ENV_BACKEND_API_HOST } from '@/config/env';

export function useServerFilenames() {
  const filenames = ref<string[]>([]);
  const status = ref<'error' | 'idle' | 'pending' | 'success'>();
  const error = ref<Error>();

  async function fetchFilenames(): Promise<void> {
    const response = await API.get<MaybeUndefined<string[]>>(
      `${ENV_BACKEND_API_HOST}/api/public/filenames?t=${ENV_ACCESS_TOKEN}`,
    );
    filenames.value = optArrayString(response.data);
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
