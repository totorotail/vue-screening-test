<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

// 비밀번호 입력 값
const password = ref('');

// NEXT 버튼 활성화 여부 (비밀번호가 입력되었는지 확인)
const isNextEnabled = computed(() => password.value.length > 0);

// 로그인한 사용자의 최근 검사 환자 찾기
const getLatestPatientNumber = (): string | null => {
    if (!authStore.user || !authStore.user.patients.length) return null;
    
    // 가장 최근 검사한 환자를 찾음 (lastExam 기준으로 정렬 후 첫 번째 환자 선택)
    const latestPatient = [...authStore.user.patients]
        .filter(patient => patient.lastExam) // 검사 기록이 있는 환자만
        .sort((a, b) => new Date(b.lastExam!).getTime() - new Date(a.lastExam!).getTime())[0]; 

    return latestPatient ? latestPatient.patientNumber : null;
};

// 비밀번호 검증 후 해당 환자의 상세 페이지로 이동
const goToAdminMode = () => {
    if (password.value === 'Admin123!') { // 실제 구현에서는 서버 요청 필요
        const latestPatientNumber = getLatestPatientNumber();
        if (latestPatientNumber) {
            router.push(`/patient-detail/${latestPatientNumber}`); // 해당 환자의 상세 페이지로 이동
        } else {
            alert('최근 검사한 환자 정보가 없습니다.');
        }
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
};
</script>


<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-[480px] bg-white p-10 shadow-lg rounded-lg text-center">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">병원관리자 모드로 돌아갑니다.</h2>

            <!-- 비밀번호 입력 -->
            <div class="text-left mb-6">
                <label for="password" class="block text-sm font-medium text-gray-600">비밀번호</label>
                <input type="password" id="password" v-model="password"
                    class="mt-2 w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="********" />
            </div>

            <!-- NEXT 버튼 -->
            <button @click="goToAdminMode" :disabled="!isNextEnabled"
                class="w-full py-3 mt-4 rounded-full text-lg font-semibold transition" :class="isNextEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-blue-200 text-gray-400 cursor-not-allowed'">
                NEXT
            </button>
        </div>
    </div>
</template>