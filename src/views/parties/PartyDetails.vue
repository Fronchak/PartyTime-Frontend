<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useAuthStore from '../../stores/auth-store';
import flashMessageStore from '../../stores/flash-message-store';
import { BASE_URL, MESSAGE_DANGER } from '../../utils/constantes';

const party = ref();
const mainPhoto = ref();
const route = useRoute();
const router = useRouter();
const authData = useAuthStore();

onMounted(async () => {
    try {
        const response = await fetch(`${BASE_URL}/parties/${route.params.id}`, {
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        const responseData = await response.json();
        if(response.ok) {
            party.value = responseData;
            console.log('responseData');
            console.log(responseData);
            mainPhoto.value = responseData.photos[0];
        }
        else if(responseData.status == 404) {
            flashMessageStore('Party not found', MESSAGE_DANGER);
            router.back();
        }
        else if(responseData.status == 401) {
            flashMessageStore('You need to login to access this page');
            router.push({
                name: 'login',
                query: { redirect: route.fullPath }
            })
        }
        else {
            flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
            router.back();            
        }
    }
    catch(e) {
        console.error(e);
        flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
        router.back();
    }
});

const data = computed(() => {
    let date = new Date(party.value.partyData);
    date = new Date(date.getTime() + 3 * 1000 * 60 * 60);
    return date.toLocaleDateString()
});
</script>

<template>
    <div class="container">
        <div v-if="!party">
            <h1>Loading...</h1>
        </div>
        <div v-else class="row">
            <div class="d-none d-md-flex col-6">
                <img class="img-fluid" :src="`${BASE_URL}/imgs/${mainPhoto}`" id="main-photo"/>
            </div>
            <div class="col-12 col-md-6 text-center text-md-start">
                <header>
                    <h1>{{ party.title }}</h1>
                </header>
                <p><span class="fw-bold">Date:</span> {{ data }}</p>
                <p><span class="fw-bold">Description:</span></p>
                <p class="ps-4">{{ party.description }}</p>
            </div>
        </div>
        <div v-if="party" class="mt-3" >
            <header>
                <h2 class="fw-bold fs-1 mb-3">Gallery</h2>
            </header>
            <div id="gallery">
                <div class="img-container" v-for="photo in party.photos" :key="photo">
                    <img :src="`${BASE_URL}/imgs/${photo}`" @mouseover="mainPhoto = photo" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    align-self: flex-start;
}

#gallery {
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;
}

.img-container {
    border: 5px solid #CCC;
    transition: 0.5s;
}

.img-container:hover {
    border-color: #222;
}

#main-photo {
    width: 100%;
    max-height: 400px;
}

#gallery img {
    width: 200px;
    height: 200px;
}
</style>