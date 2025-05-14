<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
      <form @submit.prevent="forgotPassword">
        <InputField
          id="forgot-email"
          label="Email"
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Send Reset Link
        </button>
      </form>
      <p class="mt-4 text-center">
        <router-link to="/login" class="text-blue-600 hover:underline"
          >Back to Login</router-link
        >
      </p>
      <p v-if="message" class="mt-4 text-green-500 text-center">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import InputField from '../components/InputField.vue';
  
  export default {
    name: 'ForgotPassword',
    components: { InputField },
    data() {
      return {
        email: '',
        message: '',
        error: '',
      };
    },
    methods: {
      async forgotPassword() {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/auth/forgot-password',
            { email: this.email }
          );
          this.message = response.data.message;
          this.error = '';
        } catch (err) {
          this.error = err.response?.data?.message || 'Failed to send reset link';
          this.message = '';
        }
      },
    },
  };
  </script>