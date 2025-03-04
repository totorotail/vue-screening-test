<script setup lang="ts">
import { ref } from 'vue';
import HospitalForm from '../components/HospitalForm.vue';
import TermsAgreement from '../components/TermsAgreement.vue';

const agreed = ref(false);
const signupData = ref<object | null>(null);

const handleSignup = (data: object) => {
    signupData.value = data;
    console.log('회원가입 완료:', data);
};
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <TermsAgreement v-model:agreed="agreed" />
        <button :disabled="!agreed" class="w-64 bg-blue-500 text-white p-2 mt-4 rounded disabled:bg-gray-300">
            NEXT
        </button>

        <HospitalForm v-if="agreed" @submit="handleSignup" />
    </div>
</template>
