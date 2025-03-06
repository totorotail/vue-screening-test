<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import TermsAgreement from '../components/TermsAgreement.vue';
import PatientForm from '../components/PatientForm.vue';
import WideLogo from '../components/WideLogo.vue';

const router = useRouter();
const authStore = useAuthStore();
const agreed = ref(false);
const showForm = ref(false);

const handleNext = () => {
    if (agreed.value) {
        showForm.value = true;
    }
};

// ✅ 환자 등록 완료 시 실행
const handlePatientRegistrationComplete = (patientData: any) => {
    authStore.registerPatient(patientData);
    router.push('/patient-list'); // 환자리스트 페이지로 이동
};

// ✅ 환자 등록 페이지 닫기 기능
const closePage = () => {
    router.push('/'); // 로그인 페이지로 이동
};
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" />

        <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">환자등록</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg mt-4 flex flex-col items-center">
            <TermsAgreement v-if="!showForm" v-model:agreed="agreed" />
            <button @click="handleNext" v-if="!showForm" class="w-32 py-3 bg-blue-500 text-white font-semibold rounded-full">NEXT</button>
            <PatientForm v-if="showForm" class="w-full" @submit="handlePatientRegistrationComplete" />
        </div>
    </div>
</template>
