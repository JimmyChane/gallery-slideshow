import { onUnmounted, ref } from 'vue';

const INITIAL_DELAY = 500;
const MIN_DELAY = 50;
const ACCELERATION = 0.8;

export function useHoldAction(callback: () => void) {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null);
  const currentDelay = ref(500);

  const run = () => {
    callback();
    currentDelay.value = Math.max(MIN_DELAY, currentDelay.value * ACCELERATION);
    timer.value = setTimeout(run, currentDelay.value);
  };

  const start = () => {
    if (timer.value) return;
    callback();
    currentDelay.value = INITIAL_DELAY;
    timer.value = setTimeout(run, INITIAL_DELAY);
  };

  const stop = () => {
    if (timer.value) {
      clearTimeout(timer.value);
      timer.value = null;
    }
  };

  onUnmounted(stop);

  return { start, stop };
}
