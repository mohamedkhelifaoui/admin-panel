<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center mb-5">
      <h1 class="text-h4 me-auto">Category Management</h1>
      <v-btn v-if="isAdmin" color="#2A3D54" rounded="lg" size="large" elevation="1" prepend-icon="mdi-plus-box-outline" @click="openCategoryDialog()" class="ms-4">
        Add New Category
      </v-btn>
    </div>

    <!-- Search & Stats Card -->
    <v-card variant="flat" class="mb-5 pa-3 rounded-lg bg-blue-grey-lighten-5">
      <v-row align="center" dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            label="Search Categories (e.g., by name)"
            prepend-inner-icon="mdi-magnify"
            variant="solo"
            density="compact"
            clearable
            hide-details
            bg-color="white"
            rounded="md"
          />
        </v-col>
        <v-col cols="12" md="8" class="d-flex justify-end">
          <v-chip v-if="categoryStore.categories.length > 0" color="#2A3D54" variant="tonal" label class="me-2">
            <v-icon start>mdi-shape-outline</v-icon>
            Total Categories: {{ categoryStore.categories.length }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card>

    <!-- Category Table -->
    <v-data-table
      :headers="categoryHeaders"
      :items="filteredCategories"
      :loading="categoryStore.loading"
      :search="searchQuery"
      class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <v-avatar size="40">
          <v-img :src="item.image" :alt="item.name" cover>
            <template v-slot:error>
              <span class="text-subtitle-2">N/A</span>
            </template>
          </v-img>
        </v-avatar>
      </template>

      <template v-slot:item.actions="{ item }" v-if="isAdmin">
        <v-tooltip text="Edit Category" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon variant="text" size="small" color="info" @click="openCategoryDialog(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Delete Category" location="top">
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon variant="text" size="small" color="error" @click="deleteCategory(item.id)">
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
          <v-icon class="mb-3" color="grey-lighten-1" size="48">mdi-shape-outline</v-icon>
          <p class="text-body-1 font-weight-medium">
            {{ searchQuery ? 'No categories found matching your search.' : 'No categories available.' }}
          </p>
          <p v-if="!searchQuery" class="text-caption text-grey">Add a new category to get started.</p>
        </div>
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
import { ref, computed } from 'vue';
import { useCategoryStore } from '../stores/categories';
import CategoryForm from '../components/CategoryForm.vue';
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)
const isAdmin = computed(() => user.value?.role === 'admin')


const categoryStore = useCategoryStore();
const searchQuery = ref('');

const categoryHeaders = ref([
  { title: 'ID', key: 'id', sortable: true, width: '70px' },
  { title: 'Image', key: 'image', sortable: false, align: 'center', width: '90px' },
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center', width: '120px' }
  
]);

const filteredCategories = computed(() => {
  if (!searchQuery.value) return categoryStore.categories;
  const query = searchQuery.value.toLowerCase().trim();
  return categoryStore.categories.filter(cat => cat.name?.toLowerCase().includes(query));
});

const categoryDialog = ref({
  show: false,
  isEdit: false,
  editId: null,
  form: {
    name: '',
    image: ''
  }
});

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
    categoryDialog.value.editId = null;
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
      await categoryStore.updateCategory(categoryDialog.value.editId, formData);
    } else {
      await categoryStore.addCategory(formData);
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

<style scoped>
.font-weight-semibold {
  font-weight: 600 !important;
}
</style>
