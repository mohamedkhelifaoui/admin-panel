<template>
  <div>
    <h1 class="text-h4 mb-6">Products Management</h1>
    
    <!-- Product Filters -->
    <v-card class="mb-6">
      <v-card-title>Filters</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="productFilters.title"
              label="Title"
              @input="filterProducts"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="productFilters.categoryId"
              :items="categoryItems"
              label="Category"
              @update:model-value="filterProducts"
            ></v-select>
          </v-col>
          <v-col cols="12" md="4">
            <v-range-slider
              v-model="productFilters.price"
              :min="0"
              :max="1000"
              :step="10"
              label="Price Range"
              @update:model-value="filterProducts"
            ></v-range-slider>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    
    <!-- Product Actions -->
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="openProductDialog()">Add Product</v-btn>
    </div>
    
    <!-- Products Table -->
    <v-data-table
      :headers="productHeaders"
      :items="productStore.filteredProducts"
      :loading="productStore.loading"
      class="elevation-1"
    >
      <template v-slot:item.image="{ item }">
        <v-avatar size="40">
          <v-img :src="item.image" :alt="item.title"></v-img>
        </v-avatar>
      </template>
      <template v-slot:item.price="{ item }">
        ${{ item.price }}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon="mdi-pencil" size="small" @click="openProductDialog(item)"></v-btn>
        <v-btn icon="mdi-delete" size="small" color="error" @click="deleteProduct(item.id)"></v-btn>
      </template>
    </v-data-table>
    
    <!-- Product Dialog -->
    <product-form
      v-model="productDialog.show"
      :is-edit="productDialog.isEdit"
      :form="productDialog.form"
      :categories="categoryItems"
      @save="saveProduct"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '../stores/products';
import { useCategoryStore } from '../stores/categories';
import ProductForm from '../components/ProductForm.vue';

const productStore = useProductStore();
const categoryStore = useCategoryStore();

// Product table headers
const productHeaders = ref([
  { title: 'ID', key: 'id' },
  { title: 'Image', key: 'image' },
  { title: 'Title', key: 'title' },
  { title: 'Price', key: 'price' },
  { title: 'Category', key: 'category.name' },
  { title: 'Actions', key: 'actions', sortable: false }
]);

// Product filters
const productFilters = ref({
  title: '',
  categoryId: null,
  price: [0, 1000]
});

// Product dialog
const productDialog = ref({
  show: false,
  isEdit: false,
  editId: null,
  form: {
    title: '',
    price: 0,
    description: '',
    categoryId: null,
    image: ''
  }
});

// Computed properties
const categoryItems = computed(() => 
  categoryStore.categories.map(category => ({
    title: category.name,
    value: category.id
  }))
);

// Methods
const filterProducts = () => {
  productStore.filterProducts(productFilters.value);
};

const openProductDialog = (product = null) => {
  if (product) {
    productDialog.value.isEdit = true;
    productDialog.value.editId = product.id;
    productDialog.value.form = {
      title: product.title,
      price: product.price,
      description: product.description,
      categoryId: product.category.id,
      image: product.image
    };
  } else {
    productDialog.value.isEdit = false;
    productDialog.value.form = {
      title: '',
      price: 0,
      description: '',
      categoryId: null,
      image: ''
    };
  }
  productDialog.value.show = true;
};

const saveProduct = async (formData) => {
  try {
    if (productDialog.value.isEdit) {
      await productStore.updateProduct(productDialog.value.editId, {
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        categoryId: formData.categoryId,
        images: [formData.image]
      });
    } else {
      await productStore.addProduct({
        title: formData.title,
        price: Number(formData.price),
        description: formData.description,
        categoryId: formData.categoryId,
        images: [formData.image]
      });
    }
    productDialog.value.show = false;
  } catch (error) {
    console.error('Error saving product:', error);
  }
};

const deleteProduct = async (id) => {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      await productStore.deleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  }
};
</script>