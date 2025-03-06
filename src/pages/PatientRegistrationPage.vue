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
const handlePatientRegistrationComplete = (patientData: { name: string; idNumber: string; phone: string; patientId: string }) => {
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
        <!-- ✅ 로고 부분 -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" />

        <!-- ✅ 타이틀 부분 -->
        <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">환자등록</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <!-- ✅ 메인 부분 -->
        <div class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg mt-4 flex flex-col items-center">
            <div v-if="!showForm" class="w-full">
                <TermsAgreement v-model:agreed="agreed" />

                <!-- NEXT 버튼을 둥글고 짧게 조정 -->
                <div class="flex justify-center mt-6">
                    <button @click="handleNext" :disabled="!agreed" class="w-32 py-3 text-white font-semibold rounded-full transition
                        disabled:bg-gray-300 disabled:text-gray-500 
                        enabled:bg-blue-500 enabled:hover:bg-blue-600">
                        NEXT
                    </button>
                </div>
            </div>

            <PatientForm v-if="showForm" class="w-full" @submit="handlePatientRegistrationComplete" />
        </div>
    </div>
</template>
