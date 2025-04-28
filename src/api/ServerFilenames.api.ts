import { useFetch } from '#app';
import { type MaybeUndefined, optArrayString } from '@chanzor/utils';
import { computed } from 'vue';

export function useServerFilenames(host: string) {
  const url = `${host}/api/public/filenames`;

  const { data, status, error, refresh } = useFetch<MaybeUndefined<string[]>>(
    url,
    { default: () => [] },
  );

  const filenames = computed(() => optArrayString(data.value));

  return { filenames, status, error, refresh };
}
