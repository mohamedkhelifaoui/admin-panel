<template>
  <v-card class="mx-auto my-12" max-width="500">
    <v-card-title>Login</v-card-title>
    <v-card-text>
      <v-alert v-if="authStore.error" type="error" class="mb-4">
        {{ authStore.error }}
      </v-alert>
      <v-form @submit.prevent="login">
        <v-text-field
          v-model="loginForm.email"
          label="Email"
          type="email"
          required
        ></v-text-field>
        <v-text-field
          v-model="loginForm.password"
          label="Password"
          type="password"
          required
        ></v-text-field>
        <v-btn 
          type="submit" 
          color="primary" 
          block 
          class="mt-4"
          :loading="authStore.loading"
        >
          Login
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Login form
const loginForm = ref({
  email: '',
  password: ''
});

const login = async () => {
  const success = await authStore.login(loginForm.value.email, loginForm.value.password);
  if (success) {
    router.push('/dashboard');
  }
};
</script>