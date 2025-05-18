import { defineStore } from 'pinia';
import api from '../services/api';

export const useUserStore = defineStore('users', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),
  actions: {
    async fetchUsers() {
      this.loading = true;
      try {
        const response = await api.get('/users');
        this.users = response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch users';
      } finally {
        this.loading = false;
      }
    },
    async addUser(user) {
      this.loading = true;
      try {
        const response = await api.post('/users', user);
        this.users.push(response.data);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to add user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async updateUser(id, user) {
      this.loading = true;
      try {
        const response = await api.put(`/users/${id}`, user);
        const index = this.users.findIndex(u => u.id === id);
        if (index !== -1) {
          this.users[index] = response.data;
        }
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async deleteUser(id) {
      this.loading = true;
      try {
        await api.delete(`/users/${id}`);
        this.users = this.users.filter(u => u.id !== id);
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete user';
        throw error;
      } finally {
        this.loading = false;
      }
    }
  },
  persist: true
});