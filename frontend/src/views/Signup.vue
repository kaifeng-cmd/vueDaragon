<template>
    <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      <form @submit.prevent="signup">
        <InputField
          id="signup-username"
          label="Username"
          v-model="username"
          placeholder="Enter your username"
          required
        />
        <InputField
          id="signup-email"
          label="Email"
          type="email"
          v-model="email"
          placeholder="Enter your email"
          required
        />
        <InputField
          id="signup-password"
          label="Password"
          type="password"
          v-model="password"
          placeholder="Enter your password"
          required
        />
        <InputField
          id="signup-confirmPassword"
          label="Confirm Password"
          type="password"
          v-model="confirmPassword"
          placeholder="Confirm your password"
          required
        />
        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        >
          Sign Up
        </button>
      </form>
      <p class="mt-4 text-center">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline"
          >Login</router-link
        >
      </p>
      <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import InputField from '../components/InputField.vue';
  
  export default {
    name: 'Signup',
    components: { InputField },
    data() {
      return {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: '',
      };
    },
    methods: {
      async signup() {
        try {
          const response = await axios.post('http://localhost:5000/api/auth/signup', {
            username: this.username,
            email: this.email,
            password: this.password,
            confirmPassword: this.confirmPassword,
          });
          localStorage.setItem('token', response.data.token);
          this.error = '';
          this.$router.push('/dashboard');
        } catch (err) {
          this.error = err.response?.data?.message || 'Signup failed';
        }
      },
    },
  };
  </script>