<template>
    <div class="min-h-screen bg-gray-100">
      <nav class="bg-blue-800 text-white p-4">
        <div class="container mx-auto flex justify-between">
          <router-link to="/" class="font-bold">MyApp</router-link>
          <div>
            <router-link to="/login" class="mr-4">Login</router-link>
            <router-link to="/signup">Signup</router-link>
          </div>
        </div>
      </nav>
      <main class="container mx-auto p-4">
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  export default {
    name: 'DefaultLayout',
  };
  </script>