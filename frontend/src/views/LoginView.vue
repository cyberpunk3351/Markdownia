<template>
  <div class="flex min-h-screen items-center justify-center bg-surface">
    <div class="w-full max-w-sm rounded-xl bg-surface-lighter p-8 shadow-xl">
      <h1 class="mb-6 text-center text-2xl font-semibold text-white">Markdown Explorer</h1>
      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label for="username" class="block text-sm text-slate-300">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            class="mt-1 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-gray-100 focus:border-surface-accent focus:outline-none"
          />
        </div>
        <div>
          <label for="password" class="block text-sm text-slate-300">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="mt-1 w-full rounded-md border border-slate-700 bg-surface px-3 py-2 text-sm text-gray-100 focus:border-surface-accent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          :disabled="loading"
          class="flex w-full justify-center rounded-md bg-surface-accent px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-70"
        >
          <span v-if="loading">Signing in...</span>
          <span v-else>Login</span>
        </button>
      </form>
      <p v-if="error" class="mt-4 text-center text-sm text-red-400">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api, setToken } from '@/api/client';

const username = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const router = useRouter();

async function onSubmit() {
  loading.value = true;
  error.value = '';
  try {
    const { data } = await api.post('/login', {
      username: username.value,
      password: password.value,
    });
    setToken(data.token);
    router.replace({ name: 'dashboard' });
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
}
</script>
