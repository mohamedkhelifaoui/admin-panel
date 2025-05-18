<template>
  <v-app-bar color="primary" app dark elevation="2">
    <!-- Left side: Menu toggle and app title -->
    <v-app-bar-nav-icon @click="$emit('update:drawer', !drawer)"></v-app-bar-nav-icon>
    
    <v-app-bar-title class="font-weight-medium">Admin Panel</v-app-bar-title>
    
    <v-spacer></v-spacer>
    
    <!-- Right side: User profile section and logout button -->
    <v-menu
      v-model="userMenuOpen"
      :close-on-content-click="true"
      location="bottom end"
      transition="slide-y-transition"
      min-width="200"
    >
      <!-- User profile button -->
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          class="user-profile-btn me-2"
          variant="text"
          height="48"
        >
          <div class="d-flex align-center">
            <span class="user-name text-body-1 me-2 d-none d-sm-block">{{ user.name }}</span>
            
            <v-avatar size="36" color="primary-lighten-1">
              <v-img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
              ></v-img>
              <span v-else class="text-h6">{{ getUserInitials(user.name) }}</span>
            </v-avatar>
          </div>
        </v-btn>
      </template>
      
      <!-- Simplified dropdown menu - only email and role -->
      <v-card>
        <!-- User avatar and name -->
        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-3">
            <v-avatar size="48" color="primary" class="me-3">
              <v-img
                v-if="user.avatar"
                :src="user.avatar"
                :alt="user.name"
              ></v-img>
              <span v-else class="text-h5">{{ getUserInitials(user.name) }}</span>
            </v-avatar>
            <div class="text-h6">{{ user.name }}</div>
          </div>
          
          <!-- Email -->
          <div class="text-body-2 text-medium-emphasis mb-2">{{ user.email }}</div>
          
          <!-- Role chip -->
          <v-chip
            size="small"
            color="primary"
            variant="outlined"
            class="text-caption"
          >
            {{ user.role }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-menu>
    
    <!-- Logout button directly in the app bar -->
    <v-btn
      color="error"
      variant="text"
      @click="handleLogout"
      class="ml-2"
    >
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

// Define props and emits
const props = defineProps({
  drawer: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['logout', 'update:drawer']);

const authStore = useAuthStore();

// User menu state
const userMenuOpen = ref(false);

// Get current user from auth store
const user = computed(() => {
  return authStore.user || {
    name: 'Admin',
    email: 'admin@mail.com',
    role: 'admin',
    avatar: null
  };
});

// Get user initials for avatar fallback
const getUserInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Handle logout
const handleLogout = () => {
  userMenuOpen.value = false;
  emit('logout');
};
</script>

<style scoped>
.user-profile-btn {
  border-radius: 24px;
  padding: 0 12px;
}

.user-name {
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>