import { computed } from 'vue';

export function useConfig() {
  const host = computed(() => import.meta.env.VITE_BACKEND_HOST);
  // TODO: move this public ACCESS_TOKEN to as prompt
  const accessToken = computed(() => import.meta.env.VITE_ACCESS_TOKEN);

  if (typeof host.value !== 'string') {
    throw new Error('BACKEND_HOST is not defined');
  }
  if (typeof accessToken.value !== 'string') {
    throw new Error('ACCESS_TOKEN is not defined');
  }

  return { host, accessToken };
}
