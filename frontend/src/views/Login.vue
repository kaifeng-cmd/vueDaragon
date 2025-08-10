<template>
  <div class="gradient-bg">
  <div class="container">
    <div class="image-section"></div>
    <div class="form-section">
      <h2>User Login</h2>
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
        <div class="options">
          <label><input type="checkbox" v-model="rememberMe"> Remember Me</label>
          <router-link to="/forgot-password" class="link">Forgot Password?</router-link>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
      <p class="toggle">
        Don't have an account? <router-link to="/signup" class="link">Sign Up</router-link>
      </p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import InputField from '../components/InputField.vue';

defineOptions({
  name: 'Login'
});

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const error = ref('');
const loading = ref(false);
const router = useRouter();

const login = async () => {
  console.log('Login function called');
  loading.value = true;
  try {
    console.log('Sending request with:', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value,
      rememberMe: rememberMe.value,
    });
    console.log('Response:', response.data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    error.value = '';
    router.push('/lobby');
  } catch (err) {
    console.error('Error:', err);
    error.value = err.response?.data?.message || 'Login failed';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.gradient-bg {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg,rgb(216, 203, 227),rgb(85, 85, 128),rgb(20, 26, 59));
  padding: 20px;
}

.container {
  display: flex;
  width: 800px;
  height: 500px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.1), -5px -5px 15px rgba(255, 255, 255, 0.3);
}

.image-section {
  flex: 1;
  background: url('../assets/night.jpg') center/cover no-repeat;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 40px;
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.form-section h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 30px;
  color: #495579;
  text-align: center;
}

.form-section input {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: none;
  border-radius: 25px;
  background: #f0f0f0;
  box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.1), inset -5px -5px 10px rgba(255, 255, 255, 0.5);
  font-size: 1em;
  outline: none;
}

.form-section .options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
  font-size: 0.9em;
  color: #666;
}

.form-section .options label {
  display: flex;
  align-items: center;
}

.form-section .options input {
  width: auto;
  margin-right: 5px;
}

.form-section button {
  width: 50%;
  padding: 10px;
  display: block; 
  margin: 0 auto;
  margin-top: 40px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6666, #ff9999);
  color: white;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.1), -5px -5px 10px rgba(255, 255, 255, 0.2);
  transition: transform 0.2s;
}

.form-section button:hover {
  transform: scale(1.05);
}

.form-section button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-section .toggle {
  margin-top: 20px;
  text-align: center;
  font-size: 0.9em;
  color: #666;
}

.form-section .link {
  color: #ff6666;
  text-decoration: none;
}

.form-section .link:hover {
  text-decoration: underline;
}

.form-section .error {
  margin-top: 10px;
  color: #ff4444;
  text-align: center;
  font-size: 0.9em;
}
</style>
