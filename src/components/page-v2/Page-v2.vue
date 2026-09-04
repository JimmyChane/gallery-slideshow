<script setup lang="ts"></script>

<template>
  <div class="page-v2">
    <div class="page-v2-body">
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-v2 {
  position: relative;

  width: 100%;
  height: 100%;
  min-height: 100svh;
  flex-grow: 1;

  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;

  .page-v2-body {
    z-index: 2;
  }
}
</style>
