import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { KEY_LOCA_STORAGE } from '../utils/constantes';

const useAuthStore = defineStore('auth', () => {
    const email = ref();
    const token = ref();

    const isAuthenticated = computed(() => {
        if(!token.value) return false;
        const decode = jwtDecode(token.value);
        if(!decode) return false;
        return decode.exp > (Date.now()/1000);
    });

    function authenticate(newToken, newEmail) {
        const localStorageData = {
            token: newToken, 
            email: newEmail
        }
        localStorage.setItem(KEY_LOCA_STORAGE, JSON.stringify(localStorageData));
        email.value = newEmail;
        token.value = newToken;
    }

    function logout() {
        localStorage.removeItem(KEY_LOCA_STORAGE);
        email.value = undefined;
        token.value = undefined;
    }

    onMounted(() => {
        const localStorageData = localStorage.getItem(KEY_LOCA_STORAGE);
        if(localStorageData) {
            const jsonData = JSON.parse(localStorageData);
            email.value = jsonData.email;
            token.value = jsonData.token;
        }
    })

    return { email, token, authenticate, logout, isAuthenticated };
});

export default useAuthStore;