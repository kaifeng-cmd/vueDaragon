<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>
      <form @submit.prevent="resetPassword">
        <InputField
          id="password"
          label="New Password"
          type="password"
          v-model="password"
          placeholder="Enter new password"
          required
        />
        <InputField
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm new password"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Reset Password
        </button>
      </form>
      <p v-if="message" class="mt-4 text-green-500 text-center">{{ message }}</p>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import InputField from '../components/InputField.vue';
  
  export default {
    name: 'ResetPassword',
    components: { InputField },
    data() {
      return {
        token: '',
        password: '',
        confirmPassword: '',
        message: '',
        error: '',
      };
    },
    mounted() {
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');
    },
    methods: {
      async resetPassword() {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/auth/reset-password',
            {
              token: this.token,
              password: this.password,
              confirmPassword: this.confirmPassword,
            }
          );
          this.message = response.data.message;
          this.error = '';
          setTimeout(() => this.$router.push('/login'), 2000);
        } catch (err) {
          this.error = err.response?.data?.message || 'Failed to reset password';
          this.message = '';
        }
      },
    },
  };
  </script>