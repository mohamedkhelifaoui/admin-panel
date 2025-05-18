<template>
  <v-navigation-drawer app :model-value="drawer" @update:model-value="updateDrawer" width="250">
    <v-list>
      <v-list-item title="Dashboard" prepend-icon="mdi-view-dashboard" to="/dashboard"></v-list-item>
      <v-list-item title="Products" prepend-icon="mdi-package-variant-closed" to="/products"></v-list-item>
      <v-list-item title="Categories" prepend-icon="mdi-shape" to="/categories"></v-list-item>
      <v-list-item title="Users" prepend-icon="mdi-account-group" to="/users"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
const props = defineProps({
  drawer: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['update:drawer']);

const updateDrawer = (value) => {
  emit('update:drawer', value);
};
</script>