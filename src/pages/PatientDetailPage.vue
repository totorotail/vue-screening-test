<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';
import PatientInfo from '../components/PatientInfo.vue';
import TotalGraph from '../components/TotalGraph.vue';
import TestRecords from '../components/TestRecords.vue';
import TestRecordDetails from '../components/TestRecordDetails.vue';
import EditPatientInfoModal from '../components/EditPatientInfoModal.vue';
import SelectTestModal from '../components/SelectTestModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testRecordDetailsRef = ref<InstanceType<typeof TestRecordDetails> | null>(null);

// 환자 정보 가져오기
const patient = ref<any>(null);

// 환자 데이터 가져오는 함수
const fetchPatient = () => {
    const patientId = String(route.params.id || '');
    if (authStore.user?.patients) {
        const foundPatient = authStore.user.patients.find(p => String(p.patientNumber) === patientId);
        console.log("🔍 찾은 환자 정보:", foundPatient);
        patient.value = foundPatient || null;
    }
};

// `authStore.user`가 로드된 후 실행되도록 `watch` 사용
watch(() => authStore.user, (newUser) => {
    if (newUser) fetchPatient();
}, { immediate: true });

// 모달창 상태
const showModal = ref(false);
const showTestModal = ref(false);
const selectedTests = ref<string[]>([]);

// 검사 선택 후 처리
const handleTestSelection = (tests: string[]) => {
    selectedTests.value = tests;
    showTestModal.value = false;
    if (tests.length > 0) {
        router.push({ name: 'TestPage', query: { patientId: patient.value.patientNumber, tests: tests.join(',') } });
    }
};

// 환자 정보 업데이트 함수
const updatePatientInfo = (updatedPatient: any) => {
    if (!authStore.user) return;
    const index = authStore.user.patients.findIndex(p => p.patientNumber === patient.value.patientNumber);
    if (index !== -1) {
        authStore.user.patients[index] = updatedPatient;
        patient.value = updatedPatient; // 화면 갱신
    }
};

// 검사 시작 핸들러
const handleStartTest = () => {
    showTestModal.value = true;
};

// 검사 기록에서 선택한 날짜 전달
const handleRecordSelection = (date: string) => {
    if (testRecordDetailsRef.value) {
        testRecordDetailsRef.value.updateSelectedDate(date);
    }
};

// 로그인 페이지로 이동
const closePage = () => {
    router.push('/');
};

</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-xl font-semibold text-gray-800">환자 상세보기</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <div class="w-[90%] max-w-[1400px] flex">
            <!-- 왼쪽: 환자 정보 -->
            <div class="w-2/5 bg-white p-6 shadow-lg rounded-lg">
                <PatientInfo :patient="patient" @editPatient="showModal = true" />

                <hr class="my-4 border-gray-300">

                <!-- 총 그래프 -->
                <TotalGraph :patient="patient" />
            </div>

            <!-- 중앙: 검사 기록 -->
            <div class="w-1/5 ml-4">
                <TestRecords :patient="patient" @startTest="handleStartTest" @recordSelected="handleRecordSelection" />
            </div>

            <!-- 오른쪽: 빈 공간 유지 -->
            <div class="w-2/5">
                <TestRecordDetails ref="testRecordDetailsRef" :patient="patient" />
            </div>
        </div>
    </div>

    <!-- 환자정보 수정 모달 -->
    <EditPatientInfoModal v-if="showModal" :patient="patient" @close="showModal = false"
        @updatePatient="updatePatientInfo" />

    <SelectTestModal v-if="showTestModal" @close="showTestModal = false" @confirm="handleTestSelection" />
</template>
