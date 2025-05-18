<template>
  <div>
    <h1 class="text-h4 mb-6">Categories Management</h1>
    
    <!-- Category Actions -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="openCategoryDialog()">Add Category</v-btn>
    </div>
    
    <!-- Categories Table -->
    <v-data-table
      :headers="categoryHeaders"
      :items="categoryStore.categories"
      :loading="categoryStore.loading"
      class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <v-avatar size="40">
          <v-img :src="item.image" :alt="item.name"></v-img>
        </v-avatar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" @click="openCategoryDialog(item)"></v-btn>
        <v-btn icon="mdi-delete" size="small" color="error" @click="deleteCategory(item.id)"></v-btn>
      </template>
    </v-data-table>
    
    <!-- Category Dialog -->
    <category-form
      v-model="categoryDialog.show"
      :is-edit="categoryDialog.isEdit"
      :form="categoryDialog.form"
      @save="saveCategory"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useCategoryStore } from '../stores/categories';
import CategoryForm from '../components/CategoryForm.vue';

const categoryStore = useCategoryStore();

// Category table headers
const categoryHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'Image', key: 'image' },
  { title: 'Name', key: 'name' },
  { title: 'Actions', key: 'actions', sortable: false }
]);

// Category dialog
const categoryDialog = ref({
  show: false,
  isEdit: false,
  editId: null,
  form: {
    name: '',
    image: ''
  }
});

// Methods
const openCategoryDialog = (category = null) => {
  if (category) {
    categoryDialog.value.isEdit = true;
    categoryDialog.value.editId = category.id;
    categoryDialog.value.form = {
      name: category.name,
      image: category.image
    };
  } else {
    categoryDialog.value.isEdit = false;
    categoryDialog.value.form = {
      name: '',
      image: ''
    };
  }
  categoryDialog.value.show = true;
};

const saveCategory = async (formData) => {
  try {
    if (categoryDialog.value.isEdit) {
      await categoryStore.updateCategory(categoryDialog.value.editId, {
        name: formData.name,
        image: formData.image
      });
    } else {
      await categoryStore.addCategory({
        name: formData.name,
        image: formData.image
      });
    }
    categoryDialog.value.show = false;
  } catch (error) {
    console.error('Error saving category:', error);
  }
};

const deleteCategory = async (id) => {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await categoryStore.deleteCategory(id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
};
</script>