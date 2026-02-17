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
    class="image-viewer-overlay"
    :style="{
      '--left': `${left}px`,
      '--top': `${top}px`,
      '--width': `${width}px`,
      '--height': `${height}px`,
    }"
    :data-active="active"
    :data-showing="showing"
  >
    <div class="image-viewer-overlay-body">
      <div class="image-viewer-overlay-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.image-viewer-overlay {
  position: fixed;

  width: 100%;
  height: 100dvh;

  display: grid;
  place-items: center;

  background-color: rgba(0, 0, 0, 0);
  box-shadow: 0 0 5rem transparent;

  pointer-events: none;
  user-select: none;

  .image-viewer-overlay-body {
    position: relative;

    width: 100%;
    height: 100dvh;

    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;

    .image-viewer-overlay-content {
      top: var(--top);
      left: var(--left);
      width: var(--width);
      height: var(--height);

      position: absolute;
      opacity: 0;
      display: grid;
      place-items: center;
    }
  }

  &[data-active='true'] {
    transition: all 700ms ease;

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        transition: all 700ms ease;
      }
    }
  }
  &[data-showing='true'] {
    background-color: rgba(0, 0, 0, 0.5);
    box-shadow: 0 0 5rem black;

    pointer-events: unset;
    user-select: unset;

    .image-viewer-overlay-body {
      .image-viewer-overlay-content {
        top: 1rem;
        left: 1rem;
        width: calc(100% - 2rem);
        height: calc(100% - 2rem);

        opacity: 1;
      }
    }
  }
}
</style>
