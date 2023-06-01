<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import flashMessageStore from '../../stores/flash-message-store';
import useAuthStore from '../../stores/auth-store';
import { isBlank, isEmail } from '../../utils/string-utils';
import { IS_VALID, IS_INVALID, BASE_URL, MESSAGE_DANGER, MESSAGE_SUCCESS } from '../../utils/constantes';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref();
const password = ref();
const emailError = ref();
const passwordError = ref();
const emailClass = ref();
const passwordClass = ref();
const wasSubmited = ref(false);

const onEmailInput = () => {
    if(isBlank(email.value)) {
        emailError.value = 'Email is required';
        emailClass.value = IS_INVALID;
    }
    else if(!isEmail(email.value)) {
        emailError.value = 'Invalid email format';
        emailClass.value = IS_INVALID;
    }
    else {
        emailError.value = undefined;
        emailClass.value = IS_VALID;
    }
}

const onPasswordInput = () => {
    if(isBlank(password.value)) {
        passwordError.value = "Password is required";
        passwordClass.value = IS_INVALID;
    }
    else {
        passwordError.value = undefined;
        passwordClass.value = IS_VALID;
    }
}

function onSubmit() {
    if(!wasSubmited.value) {
        wasSubmited.value = true;
        onEmailInput();
        onPasswordInput();
    }
    if(!emailError.value && !passwordError.value) {
        console.log('send to API');
        const data = {
            email: email.value,
            password: password.value
        }
        const jsonData = JSON.stringify(data);
        fetch(`${BASE_URL}/auth/login`, {
            method: 'post',
            body: jsonData,
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        }).then((response) => response.json())
        .then((responseData) => {
            if(responseData.status == 401) {
                flashMessageStore.setMessage(responseData.message, MESSAGE_DANGER);
                wasSubmited.value = false;
            }
            else {
                authStore.authenticate(responseData.access_token);
                flashMessageStore.setMessage('Login with success', MESSAGE_SUCCESS, 3000);
                const redirect = route.query.redirect || '/home';
                console.log(route.query);
                console.log(redirect);
                router.push({ path: redirect });
            }
        })
        .catch((e) => {
            console.log('no catch');
            console.error(e);
            flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
        })
    }
}
</script>

<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="onSubmit">
            <div class="mb-3">
                <label class="mb-3" for="email">Email</label>
                <input 
                    type="email"
                    id="email"
                    class="form-control"
                    :class="wasSubmited && emailClass"
                    placeholder="your-email@example.com"
                    v-model="email"
                    @input="onEmailInput"
                />
                <div class="invalid-feedback d-block">
                    {{ wasSubmited ? emailError : '' }}
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="password">Password</label>
                <input 
                    v-model="password"
                    type="password"
                    id="password"
                    class="form-control"
                    :class="wasSubmited && passwordClass"
                    placeholder="Type your password"
                    @input="onPasswordInput"
                />
                <div class="invalid-feedback d-block">
                    {{ wasSubmited ? passwordError : '' }}
                </div>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary d-block w-100">Login</button>
            </div>
        </form>
        <p>Doesn't have an account? <RouterLink to="/auth/register">Click here</RouterLink> to create one</p>
    </div>
</template>