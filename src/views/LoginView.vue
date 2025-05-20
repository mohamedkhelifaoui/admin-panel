<template>
  <v-card class="login-card mx-auto my-16 pa-0 rounded-xl elevation-6" max-width="480">
    <!-- Header -->
    <div class="login-header text-center py-6 px-4">
      <v-avatar size="56" class="mb-3" style="background-color: #2A3D54;">
        <v-icon size="30" color="white">mdi-shield-account</v-icon>
      </v-avatar>
          <h1 class="text-h4 font-weight-bold">Admin Portal</h1>
          <p class="text-subtitle-1 text-medium-emphasis">Sign in to continue</p>
    </div>
    <!-- Login Form -->
    <v-card-text class="pa-6">
      <!-- Alert -->
      <v-slide-y-transition>
        <v-alert
          v-if="authStore.error"
          type="error"
          variant="tonal"
          closable
          class="mb-6"
          border="start"
          border-color="error"
          icon="mdi-alert-circle"
        >
          {{ authStore.error }}
        </v-alert>
      </v-slide-y-transition>

      <v-form @submit.prevent="login">
        <v-text-field
          v-model="loginForm.email"
          label="Email Address"
          type="email"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-email-outline"
          class="mb-4"
          autocomplete="email"
          :disabled="authStore.loading"
        />

        <v-text-field
          v-model="loginForm.password"
          :type="showPassword ? 'text' : 'password'"
          label="Password"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-lock-outline"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          class="mb-2"
          autocomplete="current-password"
          :disabled="authStore.loading"
        />

        <div class="d-flex  mb-5">
          <v-checkbox
            v-model="rememberMe"
            label="Remember me"
            color="primary"
            density="compact"
            hide-details
            :disabled="authStore.loading"
          />

        </div>

        <v-btn
          type="submit"
          color="#2A3D54"
          class="text-white font-weight-bold"
          size="large"
          block
          elevation="2"
          :loading="authStore.loading"
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card-text>

    <!-- Footer -->
    <v-card-actions class="justify-center py-4">
      <small class="text-grey text-caption">&copy; {{ new Date().getFullYear() }} Admin Panel</small>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

const loginForm = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const rememberMe = ref(false);

const login = async () => {
  const success = await authStore.login(
    loginForm.value.email, 
    loginForm.value.password,
    rememberMe.value
  );
  
  if (success) {
    router.push('/dashboard');
  }
};
</script>

<style scoped>
.login-card {
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.login-header {
  background: linear-gradient(135deg, var(--v-theme-primary) 0%, var(--v-theme-primary-darken-1, #1565C0) 100%);
  position: relative;
}

.login-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(to bottom right, transparent 49%, white 50%);
}

.login-btn {
  letter-spacing: 0.5px;
  text-transform: none;
  height: 48px;
}

.v-text-field :deep(.v-field__input) {
  padding-top: 10px;
  padding-bottom: 10px;
}

.v-text-field :deep(.v-field__prepend-inner) {
  padding-right: 12px;
}
</style>