<template>
  <div>
    <h1 class="text-h4 mb-6">Dashboard</h1>
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Products</v-card-title>
          <v-card-text class="text-h3 text-center">{{ productStore.products.length }}</v-card-text>
          <v-card-actions>
            <v-btn block color="primary" to="/products">Manage Products</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Categories</v-card-title>
          <v-card-text class="text-h3 text-center">{{ categoryStore.categories.length }}</v-card-text>
          <v-card-actions>
            <v-btn block color="primary" to="/categories">Manage Categories</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Users</v-card-title>
          <v-card-text class="text-h3 text-center">{{ userStore.users.length }}</v-card-text>
          <v-card-actions>
            <v-btn block color="primary" to="/users">Manage Users</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useProductStore } from '../stores/products';
import { useCategoryStore } from '../stores/categories';
import { useUserStore } from '../stores/users';

const productStore = useProductStore();
const categoryStore = useCategoryStore();
const userStore = useUserStore();
</script>