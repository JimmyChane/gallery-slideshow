<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/module/auth/auth.store';
import { ROUTE_HOME } from '@/router/router';

import PageV2 from '@/components/page-v2/Page-v2.vue';
import PageBodyV2 from '@/components/page-v2/PageBody-v2.vue';

const router = useRouter();
const authStore = useAuthStore();
const isDisabled = computed(() => authStore.isInitializing || authStore.isLogging);

const username = ref('');
const password = ref('');

async function handleSubmit(): Promise<void> {
  await authStore.login(username.value, password.value);
}

onMounted(async () => {
  const user = await authStore.getUser();
  if (user) router.push(ROUTE_HOME.path);
});
</script>

<template>
  <PageV2>
    <PageBodyV2>
      <div class="login-wrapper">
        <h3 class="login-title">Login</h3>

        <div class="input-group">
          <label>Username</label>
          <input v-model="username" type="text" :disabled="isDisabled" />
        </div>

        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" :disabled="isDisabled" @keyup.enter="() => handleSubmit()" />
        </div>

        <span v-if="authStore.error?.length" class="error-msg">{{ authStore.error }}</span>

        <button class="login-sign-in" :disabled="isDisabled" @click="() => handleSubmit()">
          {{ authStore.isLogging ? 'Authenticating...' : 'Sign In' }}
        </button>
      </div>
    </PageBodyV2>
  </PageV2>
</template>

<style lang="scss" scoped>
$bg-main: #121212;
$bg-input: #1e1e1e;
$border-color: #333;
$primary-color: #00dc82;
$error-color: #ff5f5f;
$text-muted: #888;

.login-wrapper {
  width: 100%;
  height: 100%;
  max-height: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  flex-grow: 1;

  max-width: 20rem;
  padding: 1.5rem;
  background: $bg-main;
  color: white;

  .login-title {
    margin-bottom: 1.5rem;
  }

  .input-group {
    width: 100%;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;

    label {
      font-size: 0.8rem;
      color: $text-muted;
      margin-bottom: 4px;
    }

    input {
      padding: 10px;
      background: $bg-input;
      border: 1px solid $border-color;
      color: white;
      border-radius: 4px;
      outline: none;

      &:focus {
        border-color: $primary-color;
      }
    }
  }

  .error-msg {
    color: $error-color;
    font-size: 0.85rem;
    margin-bottom: 10px;
  }

  .login-sign-in {
    max-width: 10rem;
    margin-top: 1.5rem;

    width: 100%;
    padding: 12px;
    background-color: $primary-color;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
    transition: opacity 0.2s ease;

    &:hover:not(:disabled) {
      opacity: 0.9;
    }

    &:disabled {
      background-color: #444;
      cursor: not-allowed;
    }
  }
}
</style>
