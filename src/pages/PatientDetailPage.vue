<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestStore } from '../stores/testStore';
import WideLogo from '../components/WideLogo.vue';
import EditPatientInfoModal from '../components/EditPatientInfoModal.vue';
import SelectTestModal from '../components/SelectTestModal.vue';
import Chart from 'vue-google-charts';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testStore = useTestStore();

// ✅ 환자 정보 가져오기
const patient = ref<any>(null);

// ✅ 환자 데이터 가져오는 함수
const fetchPatient = () => {
    const patientId = String(route.params.id || '');
    if (authStore.user?.patients) {
        const foundPatient = authStore.user.patients.find(p => String(p.patientNumber) === patientId);
        console.log("🔍 찾은 환자 정보:", foundPatient);
        patient.value = foundPatient || null;
    }
};

// ✅ `authStore.user`가 로드된 후 실행되도록 `watch` 사용
watch(() => authStore.user, (newUser) => {
    if (newUser) fetchPatient();
}, { immediate: true });

// ✅ 주민등록번호로 성별 판별
const gender = computed(() => {
    if (!patient.value || !patient.value.idNumber) return '없음';
    const genderDigit = patient.value.idNumber.charAt(7);
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
});

// ✅ 모달창 상태
const showModal = ref(false);
const showTestModal = ref(false);
const selectedTests = ref<string[]>([]);

// ✅ 검사 선택 후 처리
const handleTestSelection = (tests: string[]) => {
    selectedTests.value = tests;
    showTestModal.value = false;
    if (tests.length > 0) {
        router.push({ name: 'TestPage', query: { patientId: patient.value.patientNumber, tests: tests.join(',') } });
    }
};

// ✅ 환자 정보 업데이트 함수
const updatePatientInfo = (updatedPatient: any) => {
    if (!authStore.user) return;
    const index = authStore.user.patients.findIndex(p => p.patientNumber === patient.value.patientNumber);
    if (index !== -1) {
        authStore.user.patients[index] = updatedPatient;
        patient.value = updatedPatient; // 화면 갱신
    }
};

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
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg flex justify-between">
            <h2 class="text-xl font-semibold text-gray-800">환자 상세보기</h2>
            <img src="../assets/close-icon.png" alt="닫기" class="w-6 h-6 cursor-pointer">
        </div>

        <div class="w-[90%] max-w-[1400px] flex mt-4">
            <!-- ✅ 왼쪽: 환자 정보 -->
            <div class="w-2/5 bg-white p-6 shadow-lg rounded-lg">
                <div class="flex justify-between items-center">
                    <p class="font-bold text-lg">{{ patient?.name || '없음' }}</p>
                    <img src="../assets/setting-icon.png" alt="설정" class="w-6 h-6 cursor-pointer"
                        @click="showModal = true">
                </div>

                <!-- ✅ 환자 정보 정리 (가로 정렬) -->
                <div class="mt-4">
                    <div class="flex space-x-4 text-gray-600 mt-1">
                        <span>{{ patient?.birthDate?.replace(/-/g, '.') || '없음' }}</span>
                        <span>|</span>
                        <span>{{ gender }}</span>
                        <span>|</span>
                        <span>{{ patient?.phone || '없음' }}</span>
                        <span>|</span>
                        <span>{{ patient?.patientNumber || '없음' }}</span>
                    </div>
                </div>

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
                                ['23.06.02', 0]
                            ]" :options="chartOptions" class="w-full h-full" />
                        </div>
                        <p class="text-sm text-gray-500 text-right mt-1">날짜: 23.06.02</p>
                    </div>
                </div>
            </div>

            <!-- ✅ 중앙: 검사 기록 -->
            <div class="w-1/5 ml-4 bg-white p-6 shadow-lg rounded-lg">
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-bold">검사 기록</h3>
                    <button @click="showTestModal = true"
                        class="px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-lg">검사하기</button>
                </div>
                <hr class="my-2">
                <p class="text-gray-500">검사기록이 없습니다.</p>
            </div>

            <!-- ✅ 오른쪽: 빈 공간 유지 -->
            <div class="w-2/5"></div>
        </div>
    </div>

    <!-- ✅ 환자정보 수정 모달 -->
    <EditPatientInfoModal v-if="showModal" :patient="patient" @close="showModal = false"
        @updatePatient="updatePatientInfo" />

    <SelectTestModal v-if="showTestModal" @close="showTestModal = false" @confirm="handleTestSelection" />
</template>
