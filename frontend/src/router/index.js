import { createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Signup from '../views/Signup.vue';
import ForgotPassword from '../views/ForgotPassword.vue';
import ResetPassword from '../views/ResetPassword.vue';

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
    if (!publicPages.includes(to.path) && !localStorage.getItem('token')) {
      return next('/login');
    }
    next();
  });

export default router;