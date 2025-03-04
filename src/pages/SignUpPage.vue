<script setup lang="ts">
import { ref } from 'vue';
import TermsAgreement from '../components/TermsAgreement.vue';
import HospitalForm from '../components/HospitalForm.vue';

const agreed = ref(false);
const showForm = ref(false);

const handleNext = () => {
    if (agreed.value) {
        showForm.value = true;
    }
};
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div v-if="!showForm" class="w-[600px] bg-white p-8 shadow-lg rounded-lg">
            <TermsAgreement v-model:agreed="agreed" />
            <button @click="handleNext" :disabled="!agreed" class="w-full p-3 mt-6 rounded transition"
                :class="agreed ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
                NEXT
            </button>
        </div>

        <HospitalForm v-if="showForm" />
    </div>
</template>
