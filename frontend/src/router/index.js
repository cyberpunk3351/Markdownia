import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import Dashboard from '@/views/Dashboard.vue';
import { getToken } from '@/api/client';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'dashboard',
      component: Dashboard,
      meta: { requiresAuth: true },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
});

router.beforeEach((to, _from, next) => {
  const token = getToken();
  if (to.meta.requiresAuth && !token) {
    return next({ name: 'login' });
  }
  if (to.name === 'login' && token) {
    return next({ name: 'dashboard' });
  }
  return next();
});

export default router;
