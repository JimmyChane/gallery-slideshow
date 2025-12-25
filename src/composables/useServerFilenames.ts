import { type MaybeUndefined, optArrayString } from '@chanzor/utils';
import { ref } from 'vue';

import { API } from '@/api/api';

import { useConfig } from './useConfig';

export function useServerFilenames() {
  const { host, accessToken } = useConfig();

  const filenames = ref<string[]>([]);
  const status = ref<'error' | 'idle' | 'pending' | 'success'>();
  const error = ref<Error>();

  async function fetchFilenames(): Promise<void> {
    const response = await API.get<MaybeUndefined<string[]>>(
      `${host.value}/api/public/filenames?t=${accessToken.value}`,
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
