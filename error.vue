<script setup lang="ts">
import { type NuxtError, clearError, useError } from '#app';
import { onMounted } from 'vue';

const error = useError();

const props = defineProps<{ error: NuxtError }>();

onMounted(async () => {
  if (props.error.statusCode === 404) {
    await clearError({ redirect: '/' });
  }
});
</script>

<template>
  <div>
    <p v-if="error?.statusCode === 404">
      Page not found. Redirecting to homepage...
    </p>

    <p v-else>An error occurred. Redirecting to homepage...</p>
  </div>
</template>
