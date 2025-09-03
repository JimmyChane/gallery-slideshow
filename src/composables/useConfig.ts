import { useRuntimeConfig } from '#app';
import { computed } from 'vue';

export function useConfig() {
  const config = useRuntimeConfig();

  const host = computed(() => config.public.BACKEND_HOST);
  // TODO: move this public ACCESS_TOKEN to as prompt
  const accessToken = computed(() => config.public.ACCESS_TOKEN);

  if (typeof host.value !== 'string') {
    throw new Error('BACKEND_HOST is not defined');
  }
  if (typeof accessToken.value !== 'string') {
    throw new Error('ACCESS_TOKEN is not defined');
  }

  return { host, accessToken };
}
