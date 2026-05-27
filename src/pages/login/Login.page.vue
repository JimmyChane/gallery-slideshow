<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/module/auth/auth.store';

import { HOME_ROUTE } from '../home/home.route';

const router = useRouter();

const authStore = useAuthStore();

const isDisabled = computed(() => {
  return authStore.isInitializing || authStore.isLogging;
});

const username = ref('');
const password = ref('');

async function handleSubmit(): Promise<void> {
  await authStore.login(username.value, password.value);
}

onMounted(async () => {
  const user = await authStore.getUser();
  if (user) router.push(HOME_ROUTE.path);
});
</script>

<template>
  <div class="login-wrapper">
    <div class="form-container">
      <h3>Hello login</h3>

      <div class="input-group">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          :disabled="isDisabled"
        />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          :disabled="isDisabled"
          @keyup.enter="handleSubmit"
        />
      </div>

      <p v-if="authStore.error?.length" class="error-msg">
        {{ authStore.error }}
      </p>

      <button @click="handleSubmit" :disabled="isDisabled">
        {{ authStore.isLogging ? 'Authenticating...' : 'Sign In' }}
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// Variables
$bg-main: #121212;
$bg-input: #1e1e1e;
$border-color: #333;
$primary-color: #00dc82;
$error-color: #ff5f5f;
$text-muted: #888;

.login-wrapper {
  font-family: sans-serif;
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: $bg-main;
  color: white;
  border-radius: 8px;

  .status-box {
    text-align: center;
    color: $primary-color;
  }

  .input-group {
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

  button {
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
