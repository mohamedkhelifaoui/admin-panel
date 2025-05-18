import { defineStore } from 'pinia';
import api from '../services/api';

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchCategories() {
      this.loading = true;
      try {
        const response = await api.get('/categories');
        this.categories = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch categories';
      } finally {
        this.loading = false;
      }
    },
    async addCategory(category) {
      this.loading = true;
      try {
        const response = await api.post('/categories', category);
        this.categories.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add category';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateCategory(id, category) {
      this.loading = true;
      try {
        const response = await api.put(`/categories/${id}`, category);
        const index = this.categories.findIndex(c => c.id === id);
        if (index !== -1) {
          this.categories[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update category';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteCategory(id) {
      this.loading = true;
      try {
        await api.delete(`/categories/${id}`);
        this.categories = this.categories.filter(c => c.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete category';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
  persist: true
});