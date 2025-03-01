<script setup lang="ts">
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style lang="scss" scoped>
.app {
  width: 100%;
  height: 100dvh;

  display: flex;
  align-items: stretch;
  justify-content: stretch;
}
</style>
