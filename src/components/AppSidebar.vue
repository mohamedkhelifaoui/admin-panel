<template>
  <v-navigation-drawer
    app
    :model-value="drawer"
    @update:model-value="updateDrawer"
    width="250"
    color="#2A3D54"
    dark
    elevation="2"
  >
   <!-- Header with Avatar + Title -->
    <v-list-item class="px-4 pt-6 pb-2">
    <div class="d-flex align-center">
        <v-avatar size="48" class="elevation-2 me-4" style="background-color: rgb(12, 17, 24);">
        <v-icon size="28" color="white">mdi-shield-account</v-icon>
        </v-avatar>
        <div>
        <div class="text-h6 text-white font-weight-bold">{{ panelTitle }}</div>
        <div class="text-caption text-white text-opacity-70">Manage everything easily</div>
        </div>
    </div>
    </v-list-item>
    <v-divider class="my-4" color="white" opacity="0.1" />

<!-- Navigation Items -->
<v-list nav class="py-2">
  <v-list-item
    title="Dashboard"
    prepend-icon="mdi-view-dashboard"
    to="/dashboard"
    class="sidebar-link py-3"
  />

  <v-list-item
    title="Products"
    prepend-icon="mdi-package-variant-closed"
    to="/products"
    class="sidebar-link py-3"
  />

  <v-list-item
    title="Categories"
    prepend-icon="mdi-shape"
    to="/categories"
    class="sidebar-link py-3"
  />

  <v-list-item
    v-if="isAdmin"
    title="Users"
    prepend-icon="mdi-account-group"
    to="/users"
    class="sidebar-link py-3"
  />
</v-list>

  </v-navigation-drawer>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isAdmin = computed(() => user.value?.role === 'admin')

const panelTitle = computed(() => {
  return user.value?.role === 'admin' ? 'Admin Panel' : 'Customer Panel';
}); 

const props = defineProps({
  drawer: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(['update:drawer']);

const updateDrawer = (value) => {
  emit('update:drawer', value);
};
</script>

<style scoped>
.sidebar-link {
  border-radius: 8px;
  margin: 4px 8px;
  transition: background-color 0.3s ease;
}

.sidebar-link:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.15) !important;
}
</style>
