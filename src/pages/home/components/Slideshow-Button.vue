<script setup lang="ts">
const { shape = 'square' } = defineProps<{ shape?: 'circle' | 'square' }>();
</script>

<template>
  <button type="button" class="slideshow-button" :data-shape="shape">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
$button-size: 3rem;
$transition-speed: 0.2s;
$transition-curve: cubic-bezier(0.4, 0, 0.2, 1);

.slideshow-button {
  width: $button-size;
  height: $button-size;
  min-width: $button-size;
  min-height: $button-size;
  max-width: $button-size;
  max-height: $button-size;
  aspect-ratio: 1 / 1;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  cursor: pointer;
  background-color: gray;
  color: white;

  transition: all $transition-speed $transition-curve;
  outline: none;
  user-select: none;
  box-shadow: 0 0 1rem black;
  border: none;

  &[data-shape='square'] {
    border-radius: 0.5rem;
  }

  &[data-shape='circle'] {
    border-radius: 50%;
  }

  &:hover:not(:disabled) {
    background-color: rgb(84, 84, 84);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &:active:not(:disabled) {
    background-color: #e5e7eb;
  }

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    filter: grayscale(1);
  }

  :slotted(svg) {
    width: 50%;
    height: 50%;
  }
}
</style>
