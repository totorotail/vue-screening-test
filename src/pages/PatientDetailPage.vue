<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestStore } from '../stores/testStore';
import WideLogo from '../components/WideLogo.vue';
import Chart from 'vue-google-charts'; // ✅ Vue 3에서는 이렇게 개별 import

const route = useRoute();
const authStore = useAuthStore();
const testStore = useTestStore();

// ✅ 환자 정보 가져오기
const patient = ref<any>(null);

watchEffect(() => {
    if (authStore.user?.patients) {
        patient.value = authStore.user.patients.find(p => p.patientNumber === route.params.id) || {};
    } else {
        patient.value = {}; // 빈 객체 방지
    }
});

// ✅ 주민등록번호로 성별 판별
const gender = computed(() => {
    if (!patient.value || !patient.value.idNumber) return '없음';
    const genderDigit = patient.value.idNumber.charAt(7);
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
});

// ✅ 오늘 날짜 가져오기
const today = new Date();
const formattedDate = today.toLocaleDateString('ko-KR', {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit'
});

// ✅ Google Charts 옵션
const chartOptions = {
    title: '',
    curveType: 'function',
    legend: 'none',
    vAxis: { minValue: 0, maxValue: 80 },
    chartArea: { width: '85%', height: '70%' },
    backgroundColor: '#ffffff'
};
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <!-- ✅ WideLogo 수정: 환자 검색, 환자 등록, 이용 중인 플랜 추가 -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

        <!-- ✅ 타이틀 영역 -->
        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg flex justify-between">
            <h2 class="text-xl font-semibold text-gray-800">환자 상세보기</h2>
            <img src="../assets/close-icon.png" alt="닫기" class="w-6 h-6 cursor-pointer">
        </div>

        <!-- ✅ 메인 영역 -->
        <div class="w-[90%] max-w-[1400px] flex mt-4">
            <!-- ✅ 왼쪽: 환자 정보 및 총 그래프 -->
            <div class="w-2/5 bg-white p-6 shadow-lg rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">환자 정보</h3>
                    <img src="../assets/setting-icon.png" alt="설정" class="w-6 h-6 cursor-pointer">
                </div>

                <p><strong>환자명:</strong> {{ patient?.name || '없음' }}</p>
                <p><strong>생년월일:</strong> {{ patient?.birthDate || '없음' }}</p>
                <p><strong>성별:</strong> {{ gender }}</p>
                <p><strong>번호:</strong> {{ patient?.phone || '없음' }}</p>
                <p><strong>환자번호:</strong> {{ patient?.patientNumber || '없음' }}</p>

                <!-- ✅ 환자정보와 총그래프 사이 가로선 추가 -->
                <hr class="my-4 border-gray-300">

                <!-- ✅ 총 그래프 -->
                <div class="mt-6 flex justify-between items-center">
                    <h3 class="text-lg font-bold">총 그래프</h3>
                    <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
                </div>

                <div class="overflow-y-scroll max-h-[500px]">
                    <div v-for="graph in testStore.testCategories" :key="graph.id" class="border p-4 mb-2 rounded-lg">
                        <div class="flex items-center space-x-2">
                            <span :class="[graph.bg, 'px-2 py-1 rounded text-xs font-bold text-white']">{{ graph.id
                                }}</span>
                            <p class="text-sm font-semibold">{{ graph.name }}</p>
                        </div>
                        <div class="h-32 w-full">
                            <Chart type="LineChart" :data="[
                                ['날짜', '점수'],
                                ['23.01.08', 0],
                                ['23.02.12', 0],
                                ['23.04.24', 0],
                                ['23.06.02', 0],
                                [formattedDate, 0]
                            ]" :options="chartOptions" class="w-full h-full" />
                        </div>
                        <p class="text-sm text-gray-500 text-right mt-1">날짜: {{ formattedDate }}</p>
                    </div>
                </div>
            </div>

            <!-- ✅ 중앙: 검사 기록 -->
            <div class="w-1/5 ml-4 bg-white p-6 shadow-lg rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">검사 기록</h3>
                    <!-- ✅ 검사하기 버튼 추가 -->
                    <button class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg">
                        검사하기
                    </button>
                </div>
                <hr class="my-2">
                <p class="text-gray-500">검사기록이 없습니다.</p>
            </div>

            <!-- ✅ 오른쪽: 빈 공간 유지 -->
            <div class="w-2/5"></div>
        </div>
    </div>
</template>
