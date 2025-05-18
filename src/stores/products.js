import { defineStore } from 'pinia';
import api from '../services/api';

export const useProductStore = defineStore('products', {
  state: () => ({
    products: [],
    filteredProducts: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchProducts() {
      this.loading = true;
      try {
        const response = await api.get('/products');
        this.products = response.data;
        this.filteredProducts = [...this.products];
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch products';
      } finally {
        this.loading = false;
      }
    },
    async addProduct(product) {
      this.loading = true;
      try {
        const response = await api.post('/products', product);
        this.products.push(response.data);
        this.filteredProducts = [...this.products];
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add product';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateProduct(id, product) {
      this.loading = true;
      try {
        const response = await api.put(`/products/${id}`, product);
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
          this.products[index] = response.data;
          this.filteredProducts = [...this.products];
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update product';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteProduct(id) {
      this.loading = true;
      try {
        await api.delete(`/products/${id}`);
        this.products = this.products.filter(p => p.id !== id);
        this.filteredProducts = this.filteredProducts.filter(p => p.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete product';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    filterProducts(filters) {
      this.filteredProducts = this.products.filter(product => {
        let match = true;
        
        if (filters.title && !product.title.toLowerCase().includes(filters.title.toLowerCase())) {
          match = false;
        }
        
        if (filters.categoryId && product.category.id !== filters.categoryId) {
          match = false;
        }
        
        if (filters.price && (product.price < filters.price[0] || product.price > filters.price[1])) {
          match = false;
        }
        
        return match;
      });
    }
  },
  persist: true
});