import { ref } from 'vue';

const MIN_SPEED = 0.2;
const MAX_SPEED = 4.0;
const STEP = 0.2;

export function useSlideshowSpeed() {
  const speed = ref(0.2);

  const increaseSpeed = () => {
    if (speed.value < MAX_SPEED) {
      speed.value = parseFloat((speed.value + STEP).toFixed(1));
    }
  };

  const decreaseSpeed = () => {
    if (speed.value > MIN_SPEED) {
      speed.value = parseFloat((speed.value - STEP).toFixed(1));
    }
  };

  return {
    speed,
    increaseSpeed,
    decreaseSpeed,
    isMax: () => speed.value >= MAX_SPEED,
    isMin: () => speed.value <= MIN_SPEED,
  };
}
