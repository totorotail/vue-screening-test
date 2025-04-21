<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import AuthService from '../services/AuthService';
import HospitalService from '../services/HospitalService';

const route = useRoute();
const router = useRouter();

const password = ref('');
const showPasswordError = ref(false);
const isSubmitting = ref(false);

// 로그인된 병원 이메일 추출
const email = AuthService.getUserEmail();

// NEXT 버튼 활성화
const isNextEnabled = computed(() => password.value.length > 0 && !isSubmitting.value);

// 병원 비밀번호 검증 후 환자 상세 페이지 이동
const goToPatientDetail = async () => {
    isSubmitting.value = true;
    showPasswordError.value = false;

    try {
        if (!email) throw new Error('병원 이메일 정보 없음');

        // 로그인 재시도 (비밀번호 검증 용도)
        await HospitalService.login({ email, password: password.value });

        // 성공 → 환자 상세 페이지 이동
        const patientId = route.query.patientId;
        if (patientId) {
            router.push(`/patient-detail/${patientId}`);
        } else {
            showPasswordError.value = true;
        }
    } catch (error) {
        showPasswordError.value = true;
        console.error('비밀번호 검증 실패:', error);
    } finally {
        isSubmitting.value = false;
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="w-[480px] bg-white p-10 shadow-lg rounded-lg text-center">
            <h2 class="text-2xl font-bold mb-6 text-gray-800">병원관리자 모드로 돌아갑니다.</h2>

            <!-- 비밀번호 입력 -->
            <div class="text-left mb-6">
                <label class="text-sm font-medium text-gray-600">비밀번호 *</label>
                <input type="password" v-model="password" placeholder="비밀번호를 입력하세요"
                    class="mt-2 w-full px-4 py-3 border rounded-lg bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <p v-if="showPasswordError" class="text-orange-500 text-xs mt-2">
                    비밀번호가 맞지 않습니다.
                </p>
            </div>

            <!-- NEXT 버튼 -->
            <button @click="goToPatientDetail" :disabled="!isNextEnabled"
                class="w-full py-3 mt-4 rounded-full text-lg font-semibold transition" :class="isNextEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-blue-200 text-gray-400 cursor-not-allowed'">
                NEXT
            </button>
        </div>
    </div>
</template>
