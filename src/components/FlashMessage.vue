<script setup>
import flashMessageStore from '../stores/flash-message-store';

</script>

<template>
    <div v-if="flashMessageStore.message" class="p-4 pb-0" id="flash-message-container">
        <div class="alert" :class="flashMessageStore.messageClass" role="alert">
            {{ flashMessageStore.message }}
        </div>
    </div>
</template>

<style scoped>
#flash-message-container {
    max-width: 560px;
    margin: 0 auto;
}
</style>