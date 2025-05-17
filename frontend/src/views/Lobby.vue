<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow-sm">
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
      </div>
    </header>
    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <p>Welcome, {{ user.name }}! This is your dashboard.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { NButton } from 'naive-ui'

const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
const user = ref({
  name: userData.username || 'Guest',
  email: userData.email || 'guest@example.com',
});
</script>