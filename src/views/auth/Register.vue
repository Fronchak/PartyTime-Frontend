<script setup>
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import flashMessageStore from '../../stores/flash-message-store';
import { isBlank, isEmail } from '../../utils/string-utils';
import useAuthStore from '../../stores/auth-store';
import { IS_VALID, IS_INVALID, BASE_URL } from '../../utils/constantes';

const router = useRouter();
const authStore = useAuthStore();
const name = ref();
const email = ref();
const password = ref();
const confirmPassword = ref();
const wasSubmited = ref(false);

const nameError = ref();
const emailError = ref();
const passwordError = ref();
const confirmPasswordError = ref();

const nameClass = ref();
const emailClass = ref();
const passwordClass = ref();
const confirmPasswordClass = ref();

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

const onPasswordInput = () => {
    if(isBlank(password.value)) {
        passwordError.value = "Password is required";
        passwordClass.value = IS_INVALID;
        if(!isBlank(confirmPassword.value)) {
            confirmPasswordError.value = "Passwords must match";
            confirmPasswordClass.value = IS_INVALID;
        }
        else {
            confirmPasswordError.value = "Confirm passwords must match";
            confirmPasswordClass.value = IS_INVALID;
        }
    }
    else {
        checkPasswords();
    }
}

function checkPasswords() {
    if(password.value !== confirmPassword.value) {
        passwordError.value = "Passwords must match";
        passwordClass.value = IS_INVALID;
        confirmPasswordError.value = "Passwords must match";
        confirmPasswordClass.value = IS_INVALID;
    }
    else {
        passwordError.value = undefined;
        passwordClass.value = IS_VALID;
        confirmPasswordError.value = undefined
        confirmPasswordClass.value = IS_VALID;
    }
}

const onConfirmPasswordInput = () => {
    if(isBlank(confirmPassword.value)) {
        confirmPasswordError.value = "Confirm password is required";
        confirmPasswordClass.value = IS_INVALID;
        if(!isBlank(password.value)) {
            passwordError.value = "Passwords must match";
            passwordClass.value = IS_INVALID;
        }
        else {
            passwordError.value = "Password is required";
            passwordClass.value = IS_INVALID;
        }
    }
    else {
        checkPasswords();
    }
}

function onSubmit() {
    if(!wasSubmited.value) {
        wasSubmited.value = true;
        onNameInput();
        onEmailInput();
        onPasswordInput();
        onConfirmPasswordInput();
    }
    if(!nameError.value && !emailError.value && !passwordError.value && !confirmPasswordError.value) {
        const data = {
            name: name.value,
            email: email.value,
            password: password.value,
            confirmPassword: confirmPassword.value
        };
        const jsonData = JSON.stringify(data);
        fetch(`${BASE_URL}/auth/register`, {
            body: jsonData,
            method: 'post',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
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
                const passwordServerError = serverErrors.find((serverError) => serverError.fieldName == 'password');
                if(passwordServerError) {
                    passwordError.value = passwordServerError.message;
                    passwordClass.value = IS_INVALID;
                }
                const confirmPasswordServerError = serverErrors.find((serverError) => serverError.fieldName == 'confirmPassword');
                if(confirmPasswordServerError) {
                    confirmPasswordError.value = confirmPasswordServerError.message;
                    confirmPasswordClass.value = IS_INVALID;
                }
                flashMessageStore.setMessage('Please verify the invalid fields', 'alert-danger');
            }
            else {
                console.log(respondaData);
                authStore.authenticate(respondaData.access_token, email.value);
                router.push({ name: 'home' });
                flashMessageStore.setMessage('Account created with success', 'alert-success');
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
        <h1>Create an Account</h1>
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
                <label class="form-label" for="confirmPassword">Confirm password</label>
                <input 
                    type="password"
                    id="confirmPassword"
                    class="form-control"
                    :class="wasSubmited && confirmPasswordClass"
                    placeholder="Repeat your password"
                    v-model="confirmPassword"
                    @input="onConfirmPasswordInput"
                />
                <div class="invalid-feedback d-block">
                    {{ wasSubmited ? confirmPasswordError : '' }}
                </div>
            </div>
            <div class="mb-3">
                <button type="submit" class="btn btn-primary d-block w-100">Create account</button>
            </div>
        </form>
        <p>Already have an account? <RouterLink to="/auth/login">Click here</RouterLink> to login</p>
    </div>
</template>