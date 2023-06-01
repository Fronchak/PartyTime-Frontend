<script setup>
import { computed } from 'vue';
import { BASE_URL } from '../utils/constantes';

const props = defineProps({
    id: String,
    title: String,
    partyData: String,
    photo: String
});

const emit = defineEmits(['deleteParty']);

function onDelete() {
    emit('deleteParty', props.id);
}

const data = computed(() => {
    let date = new Date(props.partyData);
    date = new Date(date.getTime() + 3 * 1000 * 60 * 60);
    return date.toLocaleDateString()
});
</script>

<template>
    <div class="card">
        <img :src="`${BASE_URL}/imgs/${photo}`" class="card-img-top" :alt="title" />
        <div class="card-body">
            <h4 class="card-title">{{ title }}</h4>
            <p><strong>Date: </strong>{{ data }}</p>
            <div class="buttons-container">
                <router-link :to="`/parties/${id}`" class="btn btn-success">See party</router-link>
                <router-link :to="`/parties/edit/${id}`" class="btn btn-primary">Edit</router-link>
                <button @click="onDelete()" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-img-top {
    height: 300px;
}

.buttons-container {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.buttons-container * {
    flex: 1;
    min-width: 150px;
}
</style>