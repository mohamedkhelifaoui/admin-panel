<template>
  <div>
    <h1 class="text-h4 mb-6">Users Management</h1>
    
    <!-- User Actions -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="openUserDialog()">Add User</v-btn>
    </div>
    
    <!-- Users Table -->
    <v-data-table
      :headers="userHeaders"
      :items="userStore.users"
      :loading="userStore.loading"
      class="elevation-1"
    >
      <template v-slot:item.avatar="{ item }">
        <v-avatar size="40">
          <v-img :src="item.avatar" :alt="item.name"></v-img>
        </v-avatar>
      </template>
      <template v-slot:item.role="{ item }">
        <v-chip :color="item.role === 'admin' ? 'primary' : 'secondary'">
          {{ item.role }}
        </v-chip>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" @click="openUserDialog(item)"></v-btn>
        <v-btn icon="mdi-delete" size="small" color="error" @click="deleteUser(item.id)"></v-btn>
      </template>
    </v-data-table>
    
    <!-- User Dialog -->
    <user-form
      v-model="userDialog.show"
      :is-edit="userDialog.isEdit"
      :form="userDialog.form"
      @save="saveUser"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/users';
import UserForm from '../components/UserForm.vue';

const userStore = useUserStore();

// User table headers
const userHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'Avatar', key: 'avatar' },
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false }
]);

// User dialog
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

// Methods
const openUserDialog = (user = null) => {
  if (user) {
    userDialog.value.isEdit = true;
    userDialog.value.editId = user.id;
    userDialog.value.form = {
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      avatar: user.avatar
    };
  } else {
    userDialog.value.isEdit = false;
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
    const userData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      avatar: formData.avatar
    };
    
    if (!userDialog.value.isEdit || formData.password) {
      userData.password = formData.password;
    }
    
    if (userDialog.value.isEdit) {
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
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await userStore.deleteUser(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }
};
</script>