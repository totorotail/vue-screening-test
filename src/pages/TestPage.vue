<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import TestService from '../services/TestService';
import PatientService from '../services/PatientService';

import WideLogo from '../components/WideLogo.vue';
import ExitTestModal from '../components/ExitTestModal.vue';
import TestProgressBar from '../components/TestProgressBar.vue';
import TestIntro from '../components/TestIntro.vue';
import TestMain from '../components/TestMain.vue';
import TestCompletion from '../components/TestCompletion.vue';

// 라우터 관련
const route = useRoute();
const router = useRouter();
const patientId = route.query.patientId as string;
const selectedTests = ref<string[]>((route.query.tests as string || '').split(',').filter(Boolean));
const currentTestIndex = ref(0);

// 진행 중 검사 상태
const currentTest = computed(() => selectedTests.value[currentTestIndex.value]);
const isLastTest = computed(() => currentTestIndex.value === selectedTests.value.length - 1);

// 페이지 상태
const showIntroPage = ref(true);
const showCompletionPage = ref(false);
const showExitModal = ref(false);
const loading = ref(true);

// ✅ 응답: 객관식+주관식 모두 대응
const responses = ref<{ [testAcronym: string]: { selectedOptionId: number | null, textAnswer: string }[] }>({});
const testInfo = ref<any>(null);
const testStyles = ref<Record<string, { bg: string; color: string; title: string }>>({});
const questions = computed(() => testInfo.value?.questions || []);
const isNextEnabled = computed(() =>
    responses.value[currentTest.value]?.every(r => r.selectedOptionId !== null || r.textAnswer.trim() !== '')
);

// 환자 정보
const patient = ref<any>(null);
const maskedIdNumber = computed(() =>
    patient.value?.residentRegistrationNumber
        ? patient.value.residentRegistrationNumber.slice(0, 8) + '******'
        : '정보 없음'
);
const patientPhone = computed(() => patient.value?.phoneNumber || '정보 없음');

// 환자 정보 불러오기
const fetchPatient = async () => {
    try {
        const res = await PatientService.getPatientById(Number(patientId));
        patient.value = res.data;
    } catch (error) {
        console.error('환자 정보 조회 실패:', error);
        router.push('/');
    }
};

// 테스트 스타일 미리 불러오기
const preloadTestStyles = async () => {
    try {
        const allTestsRes = await TestService.getAllTests();
        allTestsRes.data.forEach((test: any) => {
            if (selectedTests.value.includes(test.acronym)) {
                testStyles.value[test.acronym] = {
                    bg: test.badgeBgColor,
                    color: test.badgeTextColor,
                    title: test.title
                };
            }
        });
    } catch (error) {
        console.error('테스트 스타일 로딩 실패:', error);
    }
};

// 테스트 정보 불러오기
const fetchTestInfo = async (acronym: string) => {
    try {
        const res = await TestService.getTestInfo(acronym);
        const parsed = JSON.parse(res.data.questionsConfig);
        testInfo.value = {
            acronym: res.data.acronym,
            title: res.data.title,
            description: res.data.description,
            questions: parsed.questions
        };
        // 초기 응답 상태 설정
        if (!responses.value[acronym]) {
            responses.value[acronym] = parsed.questions.map(() => ({
                selectedOptionId: null,
                textAnswer: ''
            }));
        }
    } catch (err) {
        console.error('테스트 정보 불러오기 실패:', err);
    } finally {
        loading.value = false;
    }
};

// 시작, 다음, 완료
const startTest = () => {
    showIntroPage.value = false;
    fetchTestInfo(currentTest.value);
};

const goToNextTest = () => {
    currentTestIndex.value++;
    fetchTestInfo(currentTest.value);
};

const completeTest = async () => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        for (const testAcronym of selectedTests.value) {
            const answersForThisTest = responses.value[testAcronym];
            const testQuestions = JSON.parse(
                (await TestService.getTestInfo(testAcronym)).data.questionsConfig
            ).questions;

            const answerList = testQuestions.map((q: any, i: number) => ({
                questionId: q.id,
                selectedOptionId: answersForThisTest?.[i]?.selectedOptionId ?? null,
                textAnswer: answersForThisTest?.[i]?.textAnswer ?? ''
            }));
            await TestService.saveTestResult({
                patientId: Number(patientId),
                testAcronym,
                testDate: today,
                answers: answerList
            });
        }
        showCompletionPage.value = true;
    } catch (err) {
        console.error('검사 저장 실패:', err);
        alert('검사 저장 중 오류가 발생했습니다.');
    }
};

// 모달
const openExitModal = () => showExitModal.value = true;
const continueTest = () => showExitModal.value = false;
const exitToPatientDetail = () => router.push(`/patient-detail/${patientId}`);

// 시작 시 실행
onMounted(async () => {
    await fetchPatient();
    await preloadTestStyles();
});

watch(currentTestIndex, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-lg font-bold">검사하기</h2>
            <button @click="openExitModal" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <TestProgressBar :selected-tests="selectedTests" :current-test-index="currentTestIndex"
            :show-intro-page="showIntroPage" :show-completion-page="showCompletionPage" :test-styles="testStyles" />

        <TestIntro v-if="showIntroPage" :patient="patient" :masked-id-number="maskedIdNumber"
            :patient-phone="patientPhone" @start="startTest" />

        <TestMain v-else-if="!showIntroPage && !showCompletionPage && testInfo && responses[currentTest]"
            :current-test="currentTest" :test-info="testInfo" :questions="questions"
            v-model:responses="responses[currentTest]" :is-next-enabled="isNextEnabled" :is-last="isLastTest"
            @next="goToNextTest" @complete="completeTest" />

        <TestCompletion v-if="showCompletionPage" :patient-name="patient?.name ?? ''" @confirm="exitToPatientDetail" />

        <ExitTestModal :show="showExitModal" @close="continueTest" @exit="exitToPatientDetail" />
    </div>
</template>
