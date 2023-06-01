import { createRouter, createWebHistory } from 'vue-router'
import AuthContainer from '../views/auth/AuthContainer.vue';
import Register from '../views/auth/Register.vue';
import Login from '../views/auth/Login.vue';
import ProfileUpdate from '../views/auth/ProfileUpdate.vue';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Parties from '../views/parties/Parties.vue';
import PartyDetails from '../views/parties/PartyDetails.vue';
import RegisterParty from '../views/parties/RegisterParty.vue';
import EditParty from '../views/parties/EditParty.vue';
import Dashboard from '../views/Dashboard.vue';
import useAuthStore from '../stores/auth-store';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/parties',
      name: 'parties',
      component: Parties
    },
    {
      path: '/parties/register',
      name: 'register-party',
      component: RegisterParty,
      meta: { requiresAuth: true }
    },
    {
      path: '/parties/edit/:id',
      name: 'edit-party',
      component: EditParty,
      meta: { requiresAuth: true }
    },
    {
      path: '/parties/:id',
      name: 'party-details',
      component: PartyDetails
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        requiresAuth: true
      }
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
        },
        {
          path: 'update',
          name: 'profile-update',
          component: ProfileUpdate,
          meta: { requiresAuth: true }
        }
      ]
    }
  ]
});

router.beforeEach((to, from) => {
  if(to.meta.requiresAuth && !useAuthStore().isAuthenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})

export default router
