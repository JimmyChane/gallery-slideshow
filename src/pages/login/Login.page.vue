<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { useAuthStore } from '@/module/auth/auth.store';

import { HOME_ROUTE } from '../home/home.route';

const router = useRouter();

const { accessToken, isLoading, error, login } = useAuthStore();

const username = ref('');
const password = ref('');

async function handleSubmit(): Promise<void> {
  const success = await login(username.value, password.value);
  if (success) {
    router.push(HOME_ROUTE.path);
  }
}
</script>

<template>
  <div class="login-wrapper">
    <div v-if="accessToken?.length" class="status-box">
      <span>
        Logged in as:
        <strong>{{ username || 'Admin' }}</strong>
      </span>
    </div>

    <div v-else class="form-container">
      <h3>Hello login</h3>

      <div class="input-group">
        <label>Username</label>
        <input
          v-model="username"
          type="text"
          placeholder="Enter username"
          :disabled="isLoading"
        />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter password"
          :disabled="isLoading"
          @keyup.enter="handleSubmit"
        />
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>

      <button @click="handleSubmit" :disabled="isLoading">
        {{ isLoading ? 'Authenticating...' : 'Sign In' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  font-family: sans-serif;
  max-width: 400px;
  margin: 40px auto;
  padding: 20px;
  background: #121212;
  color: white;
  border-radius: 8px;
}

.input-group {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 4px;
}

input {
  padding: 10px;
  background: #1e1e1e;
  border: 1px solid #333;
  color: white;
  border-radius: 4px;
}

button {
  width: 100%;
  padding: 12px;
  background-color: #00dc82;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 10px;
}

button:disabled {
  background-color: #444;
  cursor: not-allowed;
}

.error-msg {
  color: #ff5f5f;
  font-size: 0.85rem;
}

.status-box {
  text-align: center;
  color: #00dc82;
}
</style>
