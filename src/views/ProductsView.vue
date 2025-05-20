<template>
  <div>
    <!-- Header -->
    <div class="d-flex align-center mb-5">
      <h1 class="text-h4 me-auto">Product Administration</h1>
      <v-btn v-if="isAdmin" color="#2A3D54" rounded="lg" size="large" elevation="1" prepend-icon="mdi-plus-box-outline" @click="openProductDialog()">
        Add Product
      </v-btn>
    </div>

    <!-- Filter & Stats Card -->
    <v-card variant="flat" class="mb-5 pa-3 rounded-lg bg-blue-grey-lighten-5">
      <v-row align="center" dense>
        <v-col cols="12" md="4">
          <v-text-field v-model="productFilters.title" label="Search by Title" prepend-inner-icon="mdi-magnify" variant="solo" density="compact" clearable hide-details bg-color="white" rounded="md" @input="filterProducts" />
        </v-col>
        <v-col cols="12" md="4">
          <v-select v-model="productFilters.categoryId" :items="categoryItems" label="Category" prepend-inner-icon="mdi-shape-outline" variant="solo" density="compact" clearable hide-details @update:model-value="filterProducts" />
        </v-col>
        <v-col cols="12" md="4">
          <v-range-slider v-model="productFilters.price" :min="0" :max="300" :step="10" label="Price Range" hide-details track-fill-color="#2A3D54" @update:model-value="filterProducts" />
        </v-col>
      </v-row>
    </v-card>

    <!-- Product Cards -->
    <v-row dense>
      <v-col
        v-for="item in productStore.filteredProducts"
        :key="item.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="rounded-xl elevation-2 product-card" @click="openProductDialog(item)" style="cursor: pointer;">
          <v-img :src="item.images?.[0]" height="180px" cover>
            <template #placeholder>
              <v-skeleton-loader type="image" height="180" />
            </template>
          </v-img>
          <v-card-title class="font-weight-bold text-truncate">
            {{ item.title }}
          </v-card-title>
          <v-card-subtitle class="text-grey-darken-1 px-4">
            ${{ item.price.toFixed(2) }}
          </v-card-subtitle>
          <v-card-text class="px-4 pb-2 text-truncate-3">
            {{ item.description || 'No description available.' }}
          </v-card-text>
          <v-card-actions class="justify-space-between px-4 pb-4" >
            <v-chip size="small" color="#2A3D54" variant="tonal">{{ item.category?.name }}</v-chip>
            <div v-if="isAdmin">
              <v-btn icon color="info" @click.stop="openProductDialog(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="error" @click.stop="deleteProduct(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- No Data -->
      <v-col cols="12" v-if="!productStore.filteredProducts.length && !productStore.loading">
        <div class="text-center pa-6">
          <v-icon size="48" color="grey-lighten-1">mdi-cube-outline</v-icon>
          <p class="text-body-1 font-weight-medium">No products found.</p>
        </div>
      </v-col>

      <!-- Loading -->
      <v-col cols="12" v-if="productStore.loading">
        <v-skeleton-loader type="card" class="mx-auto" max-width="300" />
      </v-col>
    </v-row>

    <!-- Product Dialog -->
    <product-form v-model="productDialog.show" :is-edit="productDialog.isEdit" :form="productDialog.form" :categories="categoryItems" @save="saveProduct" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useProductStore } from '../stores/products';
import { useCategoryStore } from '../stores/categories';
import ProductForm from '../components/ProductForm.vue';
import { useAuthStore } from '../stores/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const isAdmin = computed(() => user.value?.role === 'admin')

const productStore = useProductStore();
const categoryStore = useCategoryStore();

const productFilters = ref({
  title: '',
  categoryId: null,
  price: [0, 1000]
});

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

const categoryItems = computed(() => 
  categoryStore.categories.map(category => ({
    title: category.name,
    value: category.id
  }))
);

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
      image: product.images?.[0] || ''

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
    const payload = {
      title: formData.title,
      price: Number(formData.price),
      description: formData.description,
      categoryId: formData.categoryId,
      images: [formData.image]
    };
    if (productDialog.value.isEdit) {
      await productStore.updateProduct(productDialog.value.editId, payload);
    } else {
      await productStore.addProduct(payload);
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

<style scoped>
.font-weight-semibold {
  font-weight: 600 !important;
}
.product-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.text-truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 4.5em;
}
</style>
