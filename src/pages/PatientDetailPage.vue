<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WideLogo from '../components/WideLogo.vue';
import PatientInfo from '../components/PatientInfo.vue';
import TotalGraph from '../components/TotalGraph.vue';
import TestRecords from '../components/TestRecords.vue';
import TestRecordDetails from '../components/TestRecordDetails.vue';
import EditPatientInfoModal from '../components/EditPatientInfoModal.vue';
import SelectTestModal from '../components/SelectTestModal.vue';
import HospitalService from '../services/HospitalService';
import PatientService from '../services/PatientService';

const route = useRoute();
const router = useRouter();
const testRecordDetailsRef = ref<InstanceType<typeof TestRecordDetails> | null>(null);

const patient = ref<any>(null);
const hospitalInfo = ref<{ plan: string } | null>(null);
const showModal = ref(false);
const showTestModal = ref(false);
const selectedTests = ref<string[]>([]);
const serverError = ref(''); // 서버 에러 메시지를 저장할 변수

// 병원 정보 불러오기
const fetchHospitalInfo = async () => {
    try {
        const response = await HospitalService.getMyInfo();
        hospitalInfo.value = response.data;
    } catch (error) {
        console.error('병원 정보 불러오기 실패:', error);
        router.push('/');
    }
};

// 환자 정보 불러오기
const fetchPatient = async () => {
    try {
        const patientId = Number(route.params.id);
        const response = await PatientService.getPatientById(patientId);
        patient.value = response.data;
    } catch (error) {
        console.error('환자 정보 조회 실패:', error);
        router.push('/');
    }
};

// 페이지 로드 시 데이터 가져오기
onMounted(() => {
    fetchHospitalInfo();
    fetchPatient();
});

// 검사 선택 후 처리
const handleTestSelection = (tests: string[]) => {
    selectedTests.value = tests;
    showTestModal.value = false;
    if (tests.length > 0) {
        router.push({ name: 'TestPage', query: { patientId: patient.value.id, tests: tests.join(',') } });
    }
};

// 환자 정보 수정 함수
const updatePatientInfo = async (updated: any) => {
    serverError.value = ''; // 에러 메시지 초기화

    try {
        await PatientService.updatePatient(patient.value.id, updated);
        patient.value = { ...patient.value, ...updated }; // 화면 갱신
        showModal.value = false; // 성공 시에만 모달 닫기
    } catch (err: any) {
        console.error('환자 정보 수정 실패:', err);

        // 409 에러(Conflict)인 경우 중복 에러 메시지 설정
        if (err.response?.status === 409) {
            serverError.value = '동일한 환자번호가 이미 존재합니다.';
        } else {
            alert('환자 정보 수정에 실패했습니다.');
        }
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

// 모달 열기 핸들러
const openEditModal = () => {
    serverError.value = ''; // 모달 열 때 에러 메시지 초기화
    showModal.value = true;
};

// 로그인 페이지로 이동
const closePage = () => {
    router.push('/');
};
</script>

<template>
    <!-- 전체 페이지를 고정 높이로 설정 -->
    <div class="flex flex-col items-center min-h-screen h-screen bg-gray-50 w-full" v-if="patient && hospitalInfo">
        <!-- 헤더 영역 -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="hospitalInfo.plan" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-xl font-semibold text-gray-800">환자 상세보기</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 메인 컨텐츠 영역 - 남은 공간을 모두 채우도록 flex-grow 적용 -->
        <div class="w-[90%] max-w-[1400px] flex flex-grow overflow-hidden">
            <!-- 왼쪽: 환자 정보 -->
            <div class="basis-[35%] bg-white p-6 shadow-lg rounded-lg h-full flex flex-col">
                <!-- 환자 정보는 항상 표시 (스크롤 없음) -->
                <PatientInfo :patient="patient" @editPatient="openEditModal" />

                <hr class="my-4 border-gray-300">

                <!-- 총 그래프 (그래프 부분만 스크롤) -->
                <TotalGraph :patient="patient" />
            </div>

            <!-- 중앙: 검사 기록 -->
            <div class="basis-[25%] ml-4 h-full">
                <TestRecords :patient="patient" @startTest="handleStartTest" @recordSelected="handleRecordSelection" />
            </div>

            <!-- 오른쪽: 검사 상세 정보 -->
            <div class="basis-[40%] ml-4 h-full">
                <TestRecordDetails ref="testRecordDetailsRef" :patient="patient" />
            </div>
        </div>
    </div>

    <!-- 환자정보 수정 모달 -->
    <EditPatientInfoModal v-if="showModal" :patient="patient" :server-error="serverError" @close="showModal = false"
        @updatePatient="updatePatientInfo" class="z-50" />

    <SelectTestModal v-if="showTestModal" @close="showTestModal = false" @confirm="handleTestSelection" class="z-50" />
</template>

<style scoped>
</style>