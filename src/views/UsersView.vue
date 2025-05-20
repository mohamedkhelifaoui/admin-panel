<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center mb-5">
      <h1 class="text-h4 me-auto" >User Administration</h1>
      <v-btn color="#2A3D54" rounded="lg" size="large" elevation="1" prepend-icon="mdi-account-plus-outline" @click="openUserDialog()" class="ms-4">
        Add New User
      </v-btn>
    </div>

    <!-- Search & Stats Card -->
    <v-card variant="flat" class="mb-5 pa-3 rounded-lg bg-blue-grey-lighten-5">
      <v-row align="center" dense>
        <v-col cols="12" md="4">
          <v-text-field v-model="searchQuery" label="Search Users (e.g., by name, email)" prepend-inner-icon="mdi-magnify" variant="solo" density="compact" clearable hide-details bg-color="white" rounded="md" />
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-end">
          <v-chip v-if="userStore.users.length > 0" color="2A3D54" variant="tonal" label class="me-2">
            <v-icon start>mdi-account-group-outline</v-icon>
            Total Users: {{ userStore.users.length }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>

    <!-- Users Table -->
    <v-data-table :headers="userHeaders" :items="filteredUsers" :loading="userStore.loading" :search="searchQuery" class="elevation-1">
      <template v-slot:item.avatar="{ item }">
        <v-avatar size="40">
          <v-img v-if="item.avatar" :src="item.avatar" :alt="item.name" cover>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey-lighten-5" />
              </v-row>
            </template>
          </v-img>
          <span v-else class="text-subtitle-2">{{ getInitials(item.name) }}</span>
        </v-avatar>
      </template>

      <template v-slot:item.role="{ item }">
        <v-chip :color="item.role === 'admin' ? 'primary' : 'secondary'" size="small" label>{{ item.role }}</v-chip>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-tooltip text="Edit User" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon variant="text" size="small" color="info" @click="openUserDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
        <v-tooltip text="Delete User" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon variant="text" size="small" color="error" @click="deleteUser(item.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>

      <template v-slot:loading>
        <v-skeleton-loader type="table-row@5" />
      </template>

      <template v-slot:no-data>
        <div class="text-center pa-4">
          <v-icon class="mb-3" color="grey-lighten-1" size="48">mdi-account-search-outline</v-icon>
          <p class="text-body-1 font-weight-medium">
            {{ searchQuery ? 'No users found matching your search.' : 'No users available.' }}
          </p>
          <p v-if="!searchQuery" class="text-caption text-grey">Add a new user to get started.</p>
        </div>
      </template>
    </v-data-table>

    <!-- User Form Dialog -->
    <user-form v-model="userDialog.show" :is-edit="userDialog.isEdit" :form="userDialog.form" @save="saveUser" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'; 
import { useUserStore } from '../stores/users';
import UserForm from '../components/UserForm.vue'; 

const userStore = useUserStore();
const searchQuery = ref(''); 

// User table headers
const userHeaders = ref([
  { title: 'ID', key: 'id', width: '70px', sortable: true },
  { title: 'Avatar', key: 'avatar', sortable: false, align: 'center', width: '90px' },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true, align: 'center', width: '120px' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '120px' }
]);

// Filtered users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) {
    return userStore.users;
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase().trim();
  if (!lowerCaseQuery) { 
      return userStore.users;
  }
  return userStore.users.filter(user => {
    const nameMatch = user.name && user.name.toLowerCase().includes(lowerCaseQuery);
    const emailMatch = user.email && user.email.toLowerCase().includes(lowerCaseQuery);
    const roleMatch = user.role && user.role.toLowerCase().includes(lowerCaseQuery); 
    return nameMatch || emailMatch || roleMatch;
  });
});

// User dialog state
const userDialog = ref({
  show: false,
  isEdit: false,
  editId: null,
  form: {
    name: '',
    email: '',
    password: '',
    role: 'customer',
    avatar: ''
  }
});

// Get initials for avatar fallback
const getInitials = (name) => {
  if (!name || typeof name !== 'string') return '';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Methods
const openUserDialog = (user = null) => {
  if (user) {
    userDialog.value.isEdit = true;
    userDialog.value.editId = user.id;
    userDialog.value.form = { ...user, password: '' };
  } else {
    userDialog.value.isEdit = false;
    userDialog.value.editId = null;
    // Reset form for new user
    userDialog.value.form = {
      name: '',
      email: '',
      password: '',
      role: 'customer',
      avatar: ''
    };
  }
  userDialog.value.show = true;
};

const saveUser = async (formData) => {
  try {
    const userData = { ...formData };
    if (userDialog.value.isEdit && (!formData.password || formData.password.trim() === '')) {
      delete userData.password; 
    }
    
    if (userDialog.value.isEdit && userDialog.value.editId) {
      await userStore.updateUser(userDialog.value.editId, userData);
    } else {
      await userStore.addUser(userData);
    }
    userDialog.value.show = false;
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const deleteUser = async (id) => {
  if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    try {
      await userStore.deleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};
</script>

<style scoped>
.v-data-table {
  --v-table-header-background: rgba(0,0,0,0.02);
}
.font-weight-semibold {
  font-weight: 600 !important;
}
</style>