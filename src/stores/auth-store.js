import { ref, onMounted, computed } from 'vue';
import { defineStore } from 'pinia';
import jwtDecode from 'jwt-decode';
import { KEY_LOCA_STORAGE } from '../utils/constantes';

const useAuthStore = defineStore('auth', () => {
    const email = ref();
    const id = ref();
    const token = ref();

    const isAuthenticated = computed(() => {
        if(!token.value) return false;
        const decode = jwtDecode(token.value);
        if(!decode) return false;
        return decode.exp > (Date.now()/1000);
    });

    function authenticate(newToken) {
        console.log('no authenticate');
        console.log('newToken');
        console.log(newToken);
        const decode = jwtDecode(newToken);
        console.log(decode);
        if(decode) {
            const localStorageData = {
                token: newToken, 
                email: decode.username,
                id: decode.id
            }
            localStorage.setItem(KEY_LOCA_STORAGE, JSON.stringify(localStorageData));
            email.value = decode.username;
            id.value = decode.id;
            token.value = newToken;
        }
    }

    function logout() {
        localStorage.removeItem(KEY_LOCA_STORAGE);
        email.value = undefined;
        id.value = undefined;
        token.value = undefined;
    }

    onMounted(() => {
        const localStorageData = localStorage.getItem(KEY_LOCA_STORAGE);
        if(localStorageData) {
            const jsonData = JSON.parse(localStorageData);
            email.value = jsonData.email;
            id.value = jsonData.id;
            token.value = jsonData.token;
        }
    })

    return { email, id, token, authenticate, logout, isAuthenticated };
});

export default useAuthStore;