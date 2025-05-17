<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
    <form @submit.prevent="login">
      <InputField
        id="login-email"
        label="Email"
        type="email"
        v-model="email"
        placeholder="Enter your email"
        required
      />
      <InputField
        id="login-password"
        label="Password"
        type="password"
        v-model="password"
        placeholder="Enter your password"
        required
      />
      <div class="flex items-center mb-4">
        <input
          id="rememberMe"
          type="checkbox"
          v-model="rememberMe"
          class="mr-2"
        />
        <label for="rememberMe" class="text-sm text-gray-700">Remember Me</label>
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
        :disabled="loading"
      >
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p class="mt-4 text-center">
      <router-link to="/forgot-password" class="text-blue-600 hover:underline"
        >Forgot Password?</router-link
      >
    </p>
    <p class="mt-2 text-center">
      Don't have an account?
      <router-link to="/signup" class="text-blue-600 hover:underline"
        >Sign Up</router-link
      >
    </p>
    <p v-if="error" class="mt-4 text-red-500 text-center">{{ error }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import InputField from '../components/InputField.vue';

export default {
  name: 'Login',
  components: { InputField },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      error: '',
      loading: false,
    };
  },
  methods: {
    async login() {
      console.log('Login function called'); 
      this.loading = true;
      try {
        console.log('Sending request with:', {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        });
        const response = await axios.post('http://localhost:5000/api/auth/login', {
          email: this.email,
          password: this.password,
          rememberMe: this.rememberMe,
        });
        console.log('Response:', response.data);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        this.error = '';
        this.$router.push('/lobby');
      } catch (err) {
        console.error('Error:', err);
        this.error = err.response?.data?.message || 'Login failed';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>