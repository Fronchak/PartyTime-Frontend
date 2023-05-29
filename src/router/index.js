import { createRouter, createWebHistory } from 'vue-router'
import AuthContainer from '../views/auth/AuthContainer.vue';
import Register from '../views/auth/Register.vue';
import Login from '../views/auth/Login.vue';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthContainer,
      children: [
        {
          path: 'register',
          name: 'register',
          component: Register
        },
        {
          path: 'login',
          name: 'login',
          component: Login
        }
      ]
    }
  ]
})

export default router
