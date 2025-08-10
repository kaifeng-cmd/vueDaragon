<template>
  <div class="gradient-bg">
  <div class="container">
    <div class="image-section"></div>
    <div class="form-section">
      <h2>User Registration</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      <p class="toggle">
        Already have an account? <router-link to="/login" class="link">Login</router-link>
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
  name: 'Signup'
});

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const router = useRouter();

const signup = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/signup', {
      username: username.value,
      email: email.value,
      password: password.value,
      confirmPassword: confirmPassword.value,
    });
    localStorage.setItem('token', response.data.token);
    error.value = '';
    router.push('/dashboard');
  } catch (err) {
    error.value = err.response?.data?.message || 'Signup failed';
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
  background: linear-gradient(135deg, #fff3b0, #deecdd, #deecdd);
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
  background: url('../assets/summer.jpeg') center/cover no-repeat;
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
  margin-bottom: 20px;
  color:rgb(155, 171, 150);
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

.form-section button {
  width: 50%;
  padding: 10px;
  display: block; 
  margin: 0 auto;
  margin-top: 20px;
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
