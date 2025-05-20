<template>
  <div>
    <h1 class="text-h4  mb-8">Dashboard Overview</h1>

    <v-row dense>
      <!-- PRODUCTS -->
      <v-col cols="12" md="4">
        <v-card class="stat-card">
          <div class="d-flex align-center mb-4">
            <v-avatar size="56" class="me-4" style="background-color: #E3F2FD;">
              <v-icon size="32" color="#0D47A1">mdi-package-variant</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Products</div>
              <div class="text-caption text-grey">Total Items</div>
            </div>
          </div>

          <div class="text-h3 font-weight-black text-center text-blue-darken-4 my-4">
            {{ productStore.products.length }}
          </div>

          <v-btn color="#0D47A1" class="text-white text-caption font-weight-bold" block rounded="xl" variant="flat" to="/products">
            MANAGE PRODUCTS
          </v-btn>
        </v-card>
      </v-col>

      <!-- CATEGORIES -->
      <v-col cols="12" md="4">
        <v-card class="stat-card">
          <div class="d-flex align-center mb-4">
            <v-avatar size="56" class="me-4" style="background-color: #E8F5E9;">
              <v-icon size="32" color="#1B5E20">mdi-shape</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Categories</div>
              <div class="text-caption text-grey">Total Categories</div>
            </div>
          </div>

          <div class="text-h3 font-weight-black text-center text-green-darken-4 my-4">
            {{ categoryStore.categories.length }}
          </div>

          <v-btn color="#1B5E20" class="text-white text-caption font-weight-bold" block rounded="xl" variant="flat" to="/categories">
            MANAGE CATEGORIES
          </v-btn>
        </v-card>
      </v-col>

      <!-- USERS -->
      <v-col cols="12" md="4" v-if="isAdmin">
        <v-card class="stat-card">
          <div class="d-flex align-center mb-4">
            <v-avatar size="56" class="me-4" style="background-color: #F3E5F5;">
              <v-icon size="32" color="#4A148C">mdi-account-group</v-icon>
            </v-avatar>
            <div>
              <div class="text-subtitle-1 font-weight-bold">Users</div>
              <div class="text-caption text-grey">Total Users</div>
            </div>
          </div>

          <div class="text-h3 font-weight-black text-center text-deep-purple-darken-3 my-4">
            {{ userStore.users.length }}
          </div>

          <v-btn color="#4A148C" class="text-white text-caption font-weight-bold" block rounded="xl" variant="flat" to="/users">
            MANAGE USERS
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useProductStore } from '../stores/products';
import { useCategoryStore } from '../stores/categories';
import { useUserStore } from '../stores/users';
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const isAdmin = computed(() => user.value?.role === 'admin')
const productStore = useProductStore();
const categoryStore = useCategoryStore();
const userStore = useUserStore();
</script>

<style scoped>
.stat-card {
  background-color: #ffffffcc;
  backdrop-filter: blur(4px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid #ececec;
  transition: all 0.3s ease-in-out;
}

.stat-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}
</style>
