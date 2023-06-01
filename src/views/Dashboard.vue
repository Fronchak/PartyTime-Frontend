<script setup>
import { ref, onMounted, computed } from 'vue';
import flashMessageStore from '../stores/flash-message-store';
import { RouterLink, useRouter, useRoute } from 'vue-router';
import useAuthStore from '../stores/auth-store';
import { BASE_URL, MESSAGE_DANGER, MESSAGE_SUCCESS } from '../utils/constantes';
import UserPartyCard from '../components/UserPartyCard.vue';

const parties = ref();
const router = useRouter();
const route = useRoute();
const authData = useAuthStore();

onMounted(async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/parties`, {
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        const responseData = await response.json();
        if(response.ok) {
            parties.value = responseData;
            console.log(responseData);
        }
        else if(responseData.status == 401) {
            flashMessageStore.setMessage('You need to login to access your events');
            router.push({
                name: 'login',
                query: {
                    redirect: route.fullPath
                }
            });
        }
        else {
            flashMessageStore.setMessage('Error in loading your parties, please try again later', MESSAGE_DANGER);    
        }
    }
    catch(e) {
        flashMessageStore.setMessage('Error in loading your parties, please try again later', MESSAGE_DANGER);
    }
});

const isEmpty = computed(() => parties.value.length === 0);

async function deleteParty(id) {
    try {
        const response = await fetch(`${BASE_URL}/parties/${id}`, {
            method: 'delete',
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        if(response.ok) {
            flashMessageStore.setMessage('Party deleted with success', MESSAGE_SUCCESS);
            parties.value = parties.value.filter((party) => party.id !== id);
        }
        else {
            const responseData = await response.json();
            console.log(responseData);
            flashMessageStore.setMessage('Something went wrong', MESSAGE_DANGER);
            console.error(e);
        }
    }
    catch(e) {
        flashMessageStore.setMessage('Something went wrong', MESSAGE_DANGER);
        console.error(e);
    }
}
</script>

<template>
    <div id="dashboard-container" class="container">
        <h1>Gerencie seus eventos</h1>
        <p><RouterLink to="/parties/register">Click here</RouterLink> to register a new party</p>
        <div v-if="!parties">
            <h2>Loading your parties</h2>
        </div>
        <div v-else-if="isEmpty">
            <h2>You have 0 parties registed, <RouterLink to="/parties/register">click here</RouterLink> to register your first one.</h2>
        </div>
        <div v-else class="row g-3 row-cols-1 row-cols-sm-2 row-cols-lg-3">
            <div class="col" v-for="party in parties" :key="party.id">
                <UserPartyCard 
                    :id="party.id"
                    :title="party.title"
                    :partyData="party.partyData"
                    :photo="party.photo"
                    @deleteParty="deleteParty($event)"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
#dashboard-container {
    align-self: flex-start;
}
</style>