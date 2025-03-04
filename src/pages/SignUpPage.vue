<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import TermsAgreement from '../components/TermsAgreement.vue';
import HospitalForm from '../components/HospitalForm.vue';
import WideLogo from '../components/WideLogo.vue';

const router = useRouter();
const agreed = ref(false);
const showForm = ref(false);

const handleNext = () => {
    if (agreed.value) {
        showForm.value = true;
    }
};

// 회원가입(병원가입) 페이지 닫기 기능
const closePage = () => {
    router.push('/'); // 로그인 페이지로 이동
};
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <!-- 1. 로고 부분 -->
        <WideLogo class="w-full max-w-[900px] mt-4 mb-4" />

        <!-- 2. '병원가입' 문구 & 닫기 버튼 -->
        <div
            class="w-full max-w-[900px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">병원가입</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <!-- 3. 메인 부분 (입력 폼을 넓게 조정) -->
        <div class="w-full max-w-[900px] bg-white p-8 shadow-lg rounded-lg mt-4 flex flex-col items-center">
            <div v-if="!showForm" class="w-full max-w-[600px]">
                <TermsAgreement v-model:agreed="agreed" />
                <button @click="handleNext" :disabled="!agreed" class="w-full p-3 mt-6 rounded transition"
                    :class="agreed ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
                    NEXT
                </button>
            </div>

            <!-- 입력 폼을 올바른 크기로 정렬 -->
            <HospitalForm v-if="showForm" class="w-full max-w-[600px] mt-4" />
        </div>
    </div>
</template>
