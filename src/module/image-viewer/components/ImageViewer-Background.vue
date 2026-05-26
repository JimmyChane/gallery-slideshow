<script setup lang="ts">
defineProps<{
  width: number;
  height: number;
  top: number;
  left: number;
  showing: boolean;
  active: boolean;
}>();
</script>

<template>
  <div
    class="image-viewer-overlay-background"
    :style="{
      '--width': `${width}px`,
      '--height': `${height}px`,
      '--left': `calc(${left}px) - 1rem`,
      '--top': `calc(${top}px - 1rem)`,
    }"
    :data-showing="showing"
    :data-active="active"
  ></div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay-background {
  z-index: 1;
  position: absolute;
  top: var(--top);
  left: var(--left);
  width: var(--width);
  height: var(--height);

  user-select: none;
  pointer-events: none;

  display: flex;
  background-color: rgba(0, 0, 0, 0.66);
  border-radius: 1rem;
  overflow: hidden;

  &[data-active='true'] {
    transition: all 700ms ease;
  }
  &[data-showing='true'] {
    opacity: 1;
  }
}
</style>
