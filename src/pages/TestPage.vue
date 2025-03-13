<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestDetailsStore } from '../stores/testDetailsStore';
import { useTestStore } from '../stores/testStore';
import WideLogo from '../components/WideLogo.vue';
import ExitTestModal from '../components/ExitTestModal.vue';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testDetailsStore = useTestDetailsStore();
const testStore = useTestStore();

// ✅ 초기 페이지 상태 (검사 시작 전 화면 표시 여부)
const showIntroPage = ref(true);

// ✅ 검사 완료 화면 상태 추가
const showCompletionPage = ref(false);

// ✅ 모달 상태 변수 추가
const showExitModal = ref(false);

// ✅ 환자 정보 가져오기
const patientId = route.query.patientId as string;
const selectedTests = ref<string[]>((route.query.tests as string || '').split(',').filter(Boolean));
const currentTestIndex = ref(0);
const currentTestKey = computed(() => currentTest.value || '');

// ✅ 환자 데이터 불러오기
const patient = computed(() => {
    return authStore.user?.patients?.find(p => String(p.patientNumber) === patientId) || null;
});

// ✅ 주민번호 마스킹 처리
const maskedIdNumber = computed(() => {
    if (!patient.value?.idNumber) return '정보 없음';
    return patient.value.idNumber.slice(0, 8) + '******';
});

// ✅ 응답 데이터 저장 (타입 안정성 유지)
const responses = ref<{ [key: string]: (number | null)[] }>({});

// ✅ 현재 진행 중인 검사 가져오기
const currentTest = computed(() => selectedTests.value[currentTestIndex.value] || '');
const testInfo = computed(() => {
    if (!currentTest.value) return null;
    return testDetailsStore.testDetails[currentTest.value as keyof typeof testDetailsStore.testDetails] || null;
});

// ✅ 현재 검사 스타일 가져오기 (색상 및 한글명 포함)
const getTestStyle = (testId: string, isActive: boolean) => {
    const test = testStore.testCategories.find(t => t.id === testId);
    return test ? { color: test.color, bg: test.bg, name: test.name, isActive } : { color: '', bg: '', name: '', isActive };
};

// ✅ 현재 검사 질문 리스트 가져오기
const currentQuestions = computed(() => testInfo.value ? testInfo.value.questions : []);

// ✅ 응답 배열 초기화 (타입 안정성 유지)
watch(currentTest, (newTest) => {
    if (newTest && !responses.value[newTest]) {
        responses.value[newTest] = Array(currentQuestions.value.length).fill(null);
    }
}, { immediate: true });

// ✅ 검사 변경 시 스크롤 최상단으로 이동
watch(currentTestIndex, () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ✅ 모든 질문이 응답되었는지 확인
const isNextEnabled = computed(() => (responses.value[currentTest.value] ?? []).every(response => response !== null));

// ✅ 검사 시작 버튼
const startTest = () => {
    showIntroPage.value = false;
};

// ✅ 다음 검사로 이동
const goToNextTest = () => {
    if (currentTestIndex.value < selectedTests.value.length - 1) {
        currentTestIndex.value++;
    }
};

// ✅ 검사 완료 처리
const completeTest = () => {
    showCompletionPage.value = true;
};

// ✅ 닫기 버튼 클릭 시 모달 표시
const openExitModal = () => {
    showExitModal.value = true;
};

// ✅ '그만하기' 버튼 클릭 시 환자 상세 페이지로 이동
const exitToPatientDetail = () => {
    router.push(`/patient-detail/${patientId}`);
};

// ✅ '계속하기' 버튼 클릭 시 모달 닫기
const continueTest = () => {
    showExitModal.value = false;
};
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <!-- ✅ WideLogo -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" />

        <!-- ✅ 타이틀 영역 -->
        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg flex justify-between items-center">
            <h2 class="text-lg font-bold">검사하기</h2>
            <button @click="openExitModal" class="text-gray-600 hover:text-gray-800 text-xl">
                <img src="../assets/close-icon.png" alt="닫기" class="w-6 h-6 cursor-pointer">
            </button>
        </div>

        <!-- ✅ 검사 진행 바 (초기 화면에도 표시) -->
        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg mt-4">
            <div class="flex items-center space-x-2 overflow-x-auto">
                <template v-for="(test, index) in selectedTests" :key="test">
                    <span v-if="index > 0" class="text-gray-400 text-lg">→</span>
                    <span class="flex items-center space-x-2">
                        <span
                            :class="[getTestStyle(test, !showIntroPage && !showCompletionPage && index === currentTestIndex).bg,
                            getTestStyle(test, !showIntroPage && !showCompletionPage && index === currentTestIndex).color,
                                'px-3 py-1 rounded-full text-sm font-semibold',
                            !showIntroPage && !showCompletionPage && index === currentTestIndex ? 'text-black font-bold' : 'text-gray-400']">
                            {{ test }}
                        </span>
                        <span
                            :class="!showIntroPage && !showCompletionPage && index === currentTestIndex ? 'text-black font-bold' : 'text-gray-400'">
                            {{ getTestStyle(test, !showIntroPage && !showCompletionPage && index ===
                                currentTestIndex).name }}
                        </span>
                    </span>
                </template>
            </div>
        </div>

        <!-- ✅ 초기 화면: 검사 시작 전 -->
        <div v-if="showIntroPage"
            class="w-[90%] max-w-[1400px] bg-white px-6 py-39 shadow-md rounded-lg text-center mt-1">
            <h2 class="text-2xl font-bold mb-4">선별검사를 시작하겠습니다.</h2>
            <p class="text-gray-600 mb-8">아래의 정보가 맞다면 시작을 눌러주세요.</p>

            <!-- ✅ 환자 정보 -->
            <div class="bg-gray-100 p-6 rounded-lg inline-block text-left text-gray-700 space-y-3">
                <p><strong>환자명:</strong> {{ patient?.name || '정보 없음' }}</p>
                <p><strong>주민번호:</strong> {{ maskedIdNumber }}</p>
                <p><strong>연락처:</strong> {{ patient?.phone || '정보 없음' }}</p>
            </div>

            <div class="mt-6">
                <button @click="startTest"
                    class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                    검사시작
                </button>
            </div>
        </div>

        <!-- ✅ 검사 질문 영역 -->
        <div v-if="!showIntroPage && !showCompletionPage"
            class="w-[90%] max-w-[1400px] bg-white px-6 py-14 shadow-md rounded-lg mt-1">
            <div v-if="currentTest">
                <h2 class="text-xl font-bold">{{ testInfo?.description }}</h2>

                <div class="mt-4 max-h-[400px] overflow-y-auto space-y-4">
                    <div v-for="(question, qIndex) in currentQuestions" :key="question.id" class="border-b pb-2">
                        <p class="font-semibold">{{ question.id }}. {{ question.text }}</p>
                        <div class="mt-2 space-y-1">
                            <label v-for="(option, oIndex) in question.options" :key="oIndex"
                                class="flex items-center space-x-2 cursor-pointer">
                                <input type="radio" :name="`q${question.id}`" :value="option"
                                    v-model="responses[currentTestKey][qIndex]" class="cursor-pointer" />
                                <span>{{ option }}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- ✅ NEXT / CONFIRM 버튼 (활성/비활성 스타일 적용) -->
                <div class="flex justify-end mt-6">
                    <button v-if="currentTestIndex < selectedTests.length - 1" @click="goToNextTest"
                        :class="['px-6 py-3 rounded-full font-bold transition',
                            isNextEnabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-400 cursor-not-allowed']" :disabled="!isNextEnabled">
                        NEXT
                    </button>
                    <button v-else @click="completeTest"
                        :class="['px-6 py-3 rounded-full font-bold transition',
                            isNextEnabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-400 cursor-not-allowed']"
                        :disabled="!isNextEnabled">
                        CONFIRM
                    </button>
                </div>
            </div>
        </div>

        <!-- ✅ 검사 종료 모달 (ExitTestModal 컴포넌트) -->
        <ExitTestModal :show="showExitModal" @close="continueTest" @exit="exitToPatientDetail" />

        <!-- ✅ 검사 완료 화면 -->
        <div v-if="showCompletionPage"
            class="w-[90%] max-w-[1400px] bg-white px-6 py-55 shadow-md rounded-lg text-center mt-1">
            <h2 class="text-2xl font-bold mb-4">{{ patient?.name || '환자' }}님,</h2>
            <p class="text-xl font-bold mb-8">검사가 완료되었습니다.<br>패드를 데스크로 반납해주세요.</p>

            <div class="mt-6">
                <button @click="router.push('/return-to-admin')"
                    class="w-full max-w-xs px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
                    검사완료
                </button>
            </div>
        </div>
    </div>
</template>
