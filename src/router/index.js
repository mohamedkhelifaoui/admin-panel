import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductsView from '../views/ProductsView.vue'
import CategoriesView from '../views/CategoriesView.vue'
import UsersView from '../views/UsersView.vue'

const routes = [
  { path: '/login', name: 'login', component: LoginView, meta: { requiresAuth: false } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
  { path: '/products', name: 'products', component: ProductsView, meta: { requiresAuth: true } },
  { path: '/categories', name: 'categories', component: CategoriesView, meta: { requiresAuth: true } },
  { path: '/users', name: 'users', component: UsersView, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const user = authStore.user;

  if (requiresAuth && !authStore.isAuthenticated) {
    return next('/login');
  }

  if (to.path === '/login' && authStore.isAuthenticated) {
    return next('/dashboard');
  }

  if (requiresAdmin && user?.role !== 'admin') {
    return next('/dashboard'); 
  }

  return next();
});

export default router;
