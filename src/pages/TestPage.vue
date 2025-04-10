<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestDetailsStore } from '../stores/testDetailsStore';
import WideLogo from '../components/WideLogo.vue';
import ExitTestModal from '../components/ExitTestModal.vue';
import TestProgressBar from '../components/TestProgressBar.vue';
import TestIntro from '../components/TestIntro.vue';
import TestMain from '../components/TestMain.vue';
import TestCompletion from '../components/TestCompletion.vue';

// 라우터 및 스토어 설정
const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testDetailsStore = useTestDetailsStore();

// 화면 상태 관련 변수
const showIntroPage = ref(true); // 검사 시작 전 화면
const showCompletionPage = ref(false); // 검사 완료 후 화면
const showExitModal = ref(false); // 종료 모달 표시 여부

// 라우터에서 전달된 환자 ID와 검사 목록
const patientId = route.query.patientId as string;
const selectedTests = ref<string[]>((route.query.tests as string || '').split(',').filter(Boolean));

// 현재 검사 인덱스 및 키
const currentTestIndex = ref(0);
const currentTest = computed(() => selectedTests.value[currentTestIndex.value] || '');
const currentTestKey = computed(() => currentTest.value || '');

// 환자 정보 계산
const patient = computed(() => {
    return authStore.user?.patients?.find(p => String(p.patientNumber) === patientId) || null;
});

// 주민번호 마스킹 처리
const maskedIdNumber = computed(() => {
    if (!patient.value?.idNumber) return '정보 없음';
    return patient.value.idNumber.slice(0, 8) + '******';
});

// 각 검사에 대한 응답 저장
const responses = ref<{ [key: string]: (number | null)[] }>({});

// 현재 검사 정보와 질문
const testInfo = computed(() => {
    if (!currentTest.value) return null;
    return testDetailsStore.testDetails[currentTest.value as keyof typeof testDetailsStore.testDetails] || null;
});
const currentQuestions = computed(() => testInfo.value ? testInfo.value.questions : []);

// 새로운 검사 시작 시 응답 배열 초기화
watch(currentTest, (newTest) => {
    if (newTest && !responses.value[newTest]) {
        responses.value[newTest] = Array(currentQuestions.value.length).fill(null);
    }
}, { immediate: true });

// 검사 전환 시 스크롤 최상단으로 이동
watch(currentTestIndex, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// 현재 검사에 모든 응답이 입력되었는지 여부
const isNextEnabled = computed(() => (responses.value[currentTest.value] ?? []).every(response => response !== null));

// 화면 전환용 함수들
const startTest = () => { showIntroPage.value = false; };
const goToNextTest = () => { currentTestIndex.value++; };
const completeTest = () => { showCompletionPage.value = true; };
const openExitModal = () => { showExitModal.value = true; };
const continueTest = () => { showExitModal.value = false; };
const exitToPatientDetail = () => { router.push(`/patient-detail/${patientId}`); };
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <!-- 상단 로고 -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" />

        <!-- 헤더 영역 -->
        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-lg font-bold">검사하기</h2>
            <button @click="openExitModal" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 검사 진행 바 -->
        <TestProgressBar :selected-tests="selectedTests" :current-test-index="currentTestIndex"
            :show-intro-page="showIntroPage" :show-completion-page="showCompletionPage" />

        <!-- 검사 시작 전 화면 -->
        <TestIntro v-if="showIntroPage" :patient="patient" :masked-id-number="maskedIdNumber" @start="startTest" />

        <!-- 질문 영역 -->
        <TestMain v-else-if="!showIntroPage && !showCompletionPage" :current-test="currentTest" :test-info="testInfo"
            :questions="currentQuestions" v-model:responses="responses[currentTestKey]" :is-next-enabled="isNextEnabled"
            :is-last="currentTestIndex === selectedTests.length - 1" @next="goToNextTest" @complete="completeTest" />

        <!-- 검사 완료 화면 -->
        <TestCompletion v-if="showCompletionPage" :patient-name="patient?.name ?? ''"
            @confirm="() => router.push('/return-to-admin')" />

        <!-- 종료 모달 -->
        <ExitTestModal :show="showExitModal" @close="continueTest" @exit="exitToPatientDetail" />
    </div>
</template>