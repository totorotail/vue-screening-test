<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestStore } from '../stores/testStore';
import WideLogo from '../components/WideLogo.vue';

// ✅ Vue Router 설정
const route = useRoute();
const authStore = useAuthStore();
const testStore = useTestStore();

// ✅ URL에서 환자 ID 가져오기
const patientId = route.params.patientId;

// ✅ 오늘 날짜 (YY.MM.DD 형식)
const today = ref(new Date().toISOString().slice(2, 10).replace(/-/g, '.'));

// ✅ 환자 정보 가져오기
const patient = computed(() => {
    return authStore.user?.patients.find(p => p.patientNumber === patientId) || null;
});

// ✅ 주민등록번호로 성별 판별 (1,3 → 남자 / 2,4 → 여자)
const getGender = (idNumber: string | undefined) => {
    if (!idNumber || idNumber.length < 7) return '없음';
    const genderDigit = idNumber.charAt(7);
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
};

// ✅ 검사항목 리스트 가져오기
const testCategories = computed(() => testStore.getTestCategories);
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

        <div class="w-[90%] max-w-[1400px] bg-white p-6 shadow-md rounded-lg">
            <h2 class="text-xl font-semibold text-gray-800">환자상세보기</h2>

            <!-- ✅ 환자 기본 정보 -->
            <div class="flex justify-between items-center mt-4 p-4 border rounded-lg shadow">
                <div>
                    <p class="text-gray-700"><strong>환자명:</strong> {{ patient?.name || '없음' }}</p>
                    <p class="text-gray-700"><strong>생년월일:</strong> {{ patient?.birthDate || '없음' }}</p>
                    <p class="text-gray-700"><strong>성별:</strong> {{ getGender(patient?.idNumber) }}</p>
                    <p class="text-gray-700"><strong>번호:</strong> {{ patient?.phone || '없음' }}</p>
                    <p class="text-gray-700"><strong>환자번호:</strong> {{ patient?.patientNumber || '없음' }}</p>
                </div>
            </div>

            <!-- ✅ 총 그래프 (신규 환자 - 빈 그래프) -->
            <div class="mt-6 p-6 border rounded-lg shadow">
                <h3 class="text-lg font-semibold">총 그래프 (빈 그래프)</h3>
                <div class="grid grid-cols-2 gap-4 mt-4">
                    <div v-for="test in testCategories" :key="test.id" class="p-4 border rounded-lg shadow">
                        <div class="flex items-center">
                            <span :class="test.color" class="px-2 py-1 rounded-lg text-sm font-semibold mr-2">
                                {{ test.id }}
                            </span>
                            <span class="text-gray-700">{{ test.name }}</span>
                        </div>
                        <div class="mt-2 bg-gray-100 h-24 flex items-center justify-center text-gray-500">
                            그래프 없음
                        </div>
                        <p class="text-sm text-gray-400 mt-1">날짜: {{ today }}</p>
                    </div>
                </div>
            </div>

            <!-- ✅ 검사기록이 없는 경우 -->
            <div class="mt-6 p-6 border rounded-lg shadow text-center">
                <h3 class="text-lg font-semibold">검사기록</h3>
                <p class="text-gray-500 mt-4">검사기록이 없습니다.</p>
            </div>
        </div>
    </div>
</template>
