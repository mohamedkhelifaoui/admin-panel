<template>
  <v-app-bar color="#EEEEEE" flat height="64" elevation="0" class="px-4" >
    <!-- Toggle Sidebar -->
    <v-app-bar-nav-icon
      @click="$emit('update:drawer', !drawer)"
      class="text-grey-darken-2"
    />

    <v-spacer />

    <!-- User Profile Menu -->
    <v-menu
      v-model="userMenuOpen"
      :close-on-content-click="true"
      location="bottom end"
      transition="scale-transition"
      min-width="240"
    >
      <template v-slot:activator="{ props }">
        <v-btn
          v-bind="props"
          variant="text"
          class="d-flex align-center me-4 user-btn"
          height="48"
        >
          <v-avatar size="38" color="grey-lighten-3" class="me-3">
            <v-img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
            <span v-else class="text-subtitle-2 text-grey-darken-3">
              {{ getUserInitials(user.name) }}
            </span>
          </v-avatar>

          <div class="d-none d-sm-flex flex-column text-start">
            <span class="text-body-1 font-weight-medium text-grey-darken-4">
              {{ user.name }}
            </span>
            <span class="text-caption text-grey-darken-1">
              {{ user.role }}
            </span>
          </div>
        </v-btn>
      </template>

      <!-- Dropdown content -->
      <v-card>
        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-3">
            <v-avatar size="48" color="grey-darken-2" class="me-3">
              <v-img v-if="user.avatar" :src="user.avatar" :alt="user.name" />
              <span v-else class="text-subtitle-1 text-white">
                {{ getUserInitials(user.name) }}
              </span>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-medium">
                {{ user.name }}
              </div>
              <div class="text-body-2 text-grey-darken-1">
                {{ user.email }}
              </div>
            </div>
          </div>
          <v-chip size="small" color="grey-darken-1" variant="outlined">
            {{ user.role }}
          </v-chip>
        </v-card-text>
      </v-card>
    </v-menu>

    <!-- Logout -->
    <v-btn
      color="red-darken-1"
      variant="tonal"
      @click="handleLogout"
      class="logout-btn d-none d-sm-flex align-center"
      height="40"
    >
      <v-icon start icon="mdi-logout" />
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  drawer: { type: Boolean, default: false }
})
const emit = defineEmits(['logout', 'update:drawer'])

const authStore = useAuthStore()
const userMenuOpen = ref(false)

const user = computed(() => authStore.user || {
  name: 'Admin',
  email: 'admin@mail.com',
  role: 'admin',
  avatar: null
})

const getUserInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const handleLogout = () => {
  userMenuOpen.value = false
  emit('logout')
}
</script>

<style scoped>
.user-btn {
  text-transform: none;
  padding: 0 10px;
  min-width: 0;
}

.logout-btn {
  text-transform: none;
  padding: 0 14px;
  font-weight: 500;
  font-size: 14px;
}

.v-app-bar {
  border-bottom: 1px solid #dcdcdc;
}
</style>
