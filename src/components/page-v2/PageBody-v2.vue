<script setup lang="ts"></script>

<template>
  <div class="page-body-v2">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
.page-body-v2 {
  width: 100%;
  max-width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;

  flex-grow: 1;
}
</style>
