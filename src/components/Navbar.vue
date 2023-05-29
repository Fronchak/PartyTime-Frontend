<script setup>
import { RouterLink, useRouter } from 'vue-router';
import useAuthStore from '../stores/auth-store';
import flashMessageStore from '../stores/flash-message-store';

const authStore = useAuthStore();
const router = useRouter();

const onLogout = () => {
  authStore.logout();
  flashMessageStore.setMessage('Logout with success', undefined, 2000);
  router.push({ name: 'home' })
}
</script>

<template>
<nav class="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
  <div class="container">
    <RouterLink class="navbar-brand" to="/">
      <img src="/img/partytimelogo.png" width="30" height="24" alt="Party time logo"/>
    </RouterLink>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <RouterLink class="nav-link" aria-current="page" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link" to="/About">About</RouterLink>
        </li>
      </ul>
      <form class="d-flex" role="search">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <template v-if="authStore.isAuthenticated">
            <li class="nav-item">
              <RouterLink class="nav-link" to="/auth/login">{{ authStore.email }}</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" 
                to="/auth/logout"
                @click.prevent="onLogout"
              >Logout</RouterLink>
            </li>
          </template>
          <template v-else>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/auth/login">Login</RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink class="nav-link" to="/auth/register">Register</RouterLink>
            </li>
          </template>
        </ul>
      </form>
    </div>
  </div>
</nav>
</template>