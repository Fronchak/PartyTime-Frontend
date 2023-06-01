<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { BASE_URL } from '../utils/constantes';
const props = defineProps({
    id: String,
    title: String,
    partyData: String,
    photo: String
});

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
            <h3 class="card-title">{{ title }}</h3>
            <p class="card-text"><span class="fw-bold">Date: </span>{{ data }}</p>
        </div>
        <routerLink :to="`/parties/${id}`" class="card-button text-bg-dark fw-bold">See details</routerLink>
    </div>
</template>

<style scoped>
.card img {
    height: 200px;
}

.card .card-title {
    height: 70px;
    overflow: hidden;
}
.card-button {
    text-align: center;
    width: 100%;
    padding: 10px 0;
    transition: 0.5s;
}

.card-button:hover {
    background-color: #CCC !important;
    color: #222 !important;
}
</style>

