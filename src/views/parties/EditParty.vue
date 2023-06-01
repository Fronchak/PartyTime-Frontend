<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import flashMessageStore from '../../stores/flash-message-store';
import useAuthStore from '../../stores/auth-store';
import PartyForm from '../../components/PartyForm.vue';
import { BASE_URL, MESSAGE_DANGER } from '../../utils/constantes';

const party = ref();
const route = useRoute();
const router = useRouter();
const authData = useAuthStore();

onMounted(async() => {
    try {
        const response = await fetch(`${BASE_URL}/parties/${route.params.id}`, {
            headers: {
                'Authorization': `Bearer ${authData.token}`
            }
        });
        const responseData = await response.json();
        if(response.ok) {
            party.value = responseData;
            console.log(responseData);
        }
        else {
            console.log(responseData);
            flashMessageStore('Something went wrong', MESSAGE_DANGER);
            router.back();
        }
    }
    catch(e) {
        console.error(e);
        flashMessageStore('Something went wrong', MESSAGE_DANGER);
        router.back();
    }
});

const date = computed(() => {
    return party.value.partyData.substring(0, 10);
})

</script>

<template>
    <div id="register-party-container" class="container">
        <h1 class="text-center">Update Party</h1>
        <div v-if="party">
            <PartyForm 
                :id="party.id"
                :title="party.title"
                :description="party.description"
                :privacy="party.privacy"
                :partyData = "date"
                :oldPhotos="party.photos"
            />
        </div>
        <h2 v-else>Loading...</h2>
        
    </div>
</template>