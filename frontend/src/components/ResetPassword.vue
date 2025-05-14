<template>
    <div>
      <h2>Reset Password</h2>
      <form @submit.prevent="resetPassword">
        <input v-model="password" type="password" placeholder="New Password" required />
        <input v-model="confirmPassword" type="password" placeholder="Confirm Password" required />
        <button type="submit">Reset Password</button>
      </form>
      <p v-if="error">{{ error }}</p>
      <p v-if="message">{{ message }}</p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        token: '',
        password: '',
        confirmPassword: '',
        error: '',
        message: ''
      };
    },
    mounted() {
      // 从 URL 获取 token
      const urlParams = new URLSearchParams(window.location.search);
      this.token = urlParams.get('token');
    },
    methods: {
      async resetPassword() {
        if (this.password !== this.confirmPassword) {
          this.error = 'Passwords do not match';
          return;
        }
        try {
          const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
            token: this.token,
            password: this.password,
            confirmPassword: this.confirmPassword
          });
          this.message = response.data.message;
          this.error = '';
          // 可选：重定向到登录页面
          setTimeout(() => this.$router.push('/login'), 2000);
        } catch (err) {
          this.error = err.response?.data?.message || 'An error occurred';
        }
      }
    }
  };
  </script>