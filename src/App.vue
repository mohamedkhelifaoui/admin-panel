<template>
  <v-app>
    <app-header v-if="isAuthenticated" @logout="logout" />
    <app-sidebar v-if="isAuthenticated" v-model:drawer="drawer" />
    
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useProductStore } from './stores/products';
import { useCategoryStore } from './stores/categories';
import { useUserStore } from './stores/users';
import AppHeader from './components/AppHeader.vue';
import AppSidebar from './components/AppSidebar.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const userStore = useUserStore();

// Navigation drawer state
const drawer = ref(true);

// Computed properties
const isAuthenticated = computed(() => authStore.isAuthenticated);

// Methods
const logout = () => {
  authStore.logout();
  router.push('/login');
};

const fetchAllData = async () => {
  await Promise.all([
    productStore.fetchProducts(),
    categoryStore.fetchCategories(),
    userStore.fetchUsers()
  ]);
};

// Watch for route changes
watch(route, () => {
  // Close the drawer on mobile when route changes
  if (window.innerWidth < 960) {
    drawer.value = false;
  }
});

// Lifecycle hooks
onMounted(async () => {
  if (isAuthenticated.value) {
    await fetchAllData();
  } else {
    router.push('/login');
  }
});
</script>

<style>
.v-data-table img {
  object-fit: contain;
}
</style>