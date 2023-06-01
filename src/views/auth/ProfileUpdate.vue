<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import flashMessageStore from '../../stores/flash-message-store';
import { isBlank, isEmail } from '../../utils/string-utils';
import useAuthStore from '../../stores/auth-store';
import { IS_VALID, IS_INVALID, BASE_URL, MESSAGE_DANGER } from '../../utils/constantes';

const router = useRouter();
const authStore = useAuthStore();
const name = ref();
const email = ref();
const wasSubmited = ref(false);

const nameError = ref();
const emailError = ref();

const nameClass = ref();
const emailClass = ref();

onMounted(async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/${authStore.id}`, {
            headers: {
                //'Authorization': `Bearer ${authStore.token}`
            }
        });
        if(response.ok) {
            const data = await response.json();
            console.log(data);
            email.value = data.email;
            name.value = data.name
        }
        else {
            console.log('Response not ok');
            flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
            router.back();
        }

    }
    catch(e) {
        console.error(e);
        flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
        router.back();
    }
})

const onNameInput = () => {
    if(isBlank(name.value)) {
        nameError.value = 'Name is required';
        nameClass.value = IS_INVALID;
    }
    else {
        nameError.value = undefined;
        nameClass.value = IS_VALID;
    }
}

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

function onSubmit() {
    if(!wasSubmited.value) {
        wasSubmited.value = true;
        onNameInput();
        onEmailInput();
    }
    if(!nameError.value && !emailError.value) {
        const data = {
            name: name.value,
            email: email.value
        };
        const jsonData = JSON.stringify(data);
        fetch(`${BASE_URL}/auth`, {
            body: jsonData,
            method: 'put',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${authStore.token}`
            }
        }).then((response) => response.json())
        .then((respondaData) => {
            if(respondaData.status == 422) {
                const serverErrors = respondaData.errors;
                const nameServerError = serverErrors.find((serverError) => serverError.fieldName == 'name');
                if(nameServerError) {
                    nameError.value = nameServerError.message;
                    nameClass.value = IS_INVALID;
                }
                const emailServerError = serverErrors.find((serverError) => serverError.fieldName == 'email');
                if(emailServerError) {
                    emailError.value = emailServerError.message;
                    emailClass.value = IS_INVALID;
                }
                flashMessageStore.setMessage('Please verify the invalid fields', 'alert-danger');
            }
            else if(respondaData.status == 401) {
                flashMessageStore.setMessage('You need to login to update your profile', MESSAGE_DANGER);
                router.push({
                    name: 'login',
                    query: {
                        redirect: '/auth/update'
                    }
                });
            }
            else {
                console.log(respondaData);
                authStore.authenticate(respondaData.access_token, email.value);
                router.push({ name: 'dashboard' });
                flashMessageStore.setMessage('Profile updated with success', 'alert-success');
            }
        })
        .catch((e) => {
            console.log('no catch');
            console.error(e);
            flashMessageStore.setMessage('Something went wrong, please try again later', 'alert-danger');       
        })
    }
    else {

    }
}
</script>

<template>
    <div>
        <h1>Update your profile</h1>
        <form @submit.prevent="onSubmit" >
            <div class="mb-3">
                <label class="form-label" for="name">Name</label>
                <input 
                    type="text"
                    id="name"
                    class="form-control"
                    :class="wasSubmited && nameClass"
                    placeholder="Type your name"
                    v-model="name"
                    @input="onNameInput"
                />
                <div class="invalid-feedback d-block">
                    {{ wasSubmited ? nameError : '' }}
                </div>
            </div>
            <div class="mb-3">
                <label class="form-label" for="email">Email</label>
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
                <button type="submit" class="btn btn-primary d-block w-100">Update profile</button>
            </div>
        </form>
        <p>Already have an account? <RouterLink to="/auth/login">Click here</RouterLink> to login</p>
    </div>
</template>