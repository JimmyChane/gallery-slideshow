import { useFetch } from '#app';
import { type MaybeUndefined, optArrayString } from '@chanzor/utils';
import { type Ref, computed } from 'vue';

export function useServerFilenames(host: Ref<string>, token: Ref<string>) {
  const url = `${host.value}/api/public/filenames?t=${token.value}`;

  const { data, status, error, refresh } = useFetch<MaybeUndefined<string[]>>(
    url,
    { default: () => [] },
  );

  const filenames = computed(() => optArrayString(data.value));

  return { filenames, status, error, refresh };
}
