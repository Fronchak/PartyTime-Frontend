<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import flashMessageStore from '../../stores/flash-message-store';
import { BASE_URL, MESSAGE_DANGER } from '../../utils/constantes';
import PartyCard from '../../components/PartyCard.vue'

const router = useRouter();
const parties = ref();

onMounted(async () => {
    try {
        const response = await fetch(`${BASE_URL}/parties`);
        const responseData = await response.json();
        if(response.ok) {
            parties.value = responseData;
        }
        else {
            flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
            router.push('/');
        }
    }
    catch(e) {
        flashMessageStore.setMessage('Something went wrong, please try again later', MESSAGE_DANGER);
        router.push('/');
    }
})
</script>

<template>
    <div class="container">
        <header>
            <h1 class="mb-3">See the parties register</h1>
        </header>
        <div v-if="parties" class="row g-3 row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            <div v-for="party in parties" :key="party.id" class="col">
                <PartyCard 
                    :id="party.id"
                    :title="party.title"
                    :photo="party.photo"
                    :partyData="party.partyData"
                />
            </div>
        </div>
        <h1 v-else>Loading parties...</h1>
    </div>

</template>

<style scoped>
.container {
    align-self: flex-start;
}
</style>