<template>
  <div class="gradient-bg">
    <div class="form-container">
      <h2>Reset Password</h2>
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
        <button type="submit" :disabled="loading">
          {{ loading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
      <p v-if="message" class="success">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
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
      loading: false,
    };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
  },
  methods: {
    async resetPassword() {
      this.loading = true;
      this.message = '';
      this.error = '';
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
        setTimeout(() => this.$router.push('/login'), 2000);
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to reset password';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.gradient-bg {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg,rgb(250, 216, 240),rgb(123, 72, 115)); /* Pink to light orange/blue gradient */
  padding: 20px;
}

.form-container {
  width: 100%;
  max-width: 400px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.07);
  text-align: center;
}

:deep(label) {
  text-align: left;
}

h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 30px;
  color: rgb(123, 72, 115);
}

button {
  width: 60%;
  padding: 12px;
  margin-top: 20px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #ff6666, #ff9999);
  color: white;
  font-size: 1em;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success {
  margin-top: 15px;
  color: #28a745;
  font-size: 0.9em;
}

.error {
  margin-top: 15px;
  color: #dc3545;
  font-size: 0.9em;
}
</style>