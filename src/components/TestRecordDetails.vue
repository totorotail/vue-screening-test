<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import TestService from '../services/TestService';
import TotalGraph from './TotalGraph.vue';

const props = defineProps<{ patient: any }>();

// 타입 정의
interface TestOption {
    id: number;
    text: string;
    score?: number;
}

const isDropdownOpen = ref(false);
const selectedDate = ref<string | null>(null);
const selectedTest = ref<string>(''); // 초기값을 빈 문자열로 설정
const testDetails = ref<any>(null);
const testData = ref<any>(null);
const loading = ref(false);
const comment = ref('');

// 테스트 카테고리 정보
const testCategories = ref<any[]>([]);

// 선택 가능한 검사 목록
const availableTests = ref<string[]>([]);

// 테스트 카테고리 정보 로드
const loadTestCategories = async () => {
    try {
        const response = await TestService.getAllTests();
        testCategories.value = response.data.map((test: any) => ({
            id: test.acronym,
            name: test.title,
            bg: test.badgeBgColor,
            color: test.badgeTextColor,
            description: test.description
        }));
    } catch (error) {
        console.error('테스트 카테고리 로드 실패:', error);
    }
};

// 해당 날짜의 검사 목록 로드
const loadAvailableTests = async () => {
    if (!selectedDate.value || !props.patient?.id) return;

    try {
        const response = await TestService.getPatientTestHistorySummary(props.patient.id);
        const dateData = response.data.find((item: any) => item.testDate === selectedDate.value);

        if (dateData) {
            availableTests.value = dateData.testAcronyms;
            // 첫 번째 검사를 자동 선택
            if (availableTests.value.length > 0 && (!selectedTest.value || !availableTests.value.includes(selectedTest.value))) {
                selectedTest.value = availableTests.value[0];
            }
        } else {
            availableTests.value = [];
            selectedTest.value = '';
        }
    } catch (error) {
        console.error('검사 목록 로드 실패:', error);
        availableTests.value = [];
    }
};

// 테스트 상세 정보와 결과 로드
const loadTestDetail = async () => {
    if (!selectedDate.value || !selectedTest.value || !props.patient?.id) {
        testDetails.value = null;
        testData.value = null;
        return;
    }

    loading.value = true;
    try {
        const response = await TestService.getTestDetailWithResult(
            props.patient.id,
            selectedTest.value,
            selectedDate.value
        );

        testDetails.value = response.data;
        testData.value = {
            totalScore: response.data.totalScore,
            responses: response.data.questionsWithAnswers.map((q: any) => {
                if (q.selectedOptionId) {
                    const selectedOption = q.options.find((opt: TestOption) => opt.id === q.selectedOptionId);
                    return selectedOption ? selectedOption.text : '응답 없음';
                }
                return q.textAnswer || '응답 없음';
            })
        };

        comment.value = response.data.comment || '';
    } catch (error) {
        console.error('테스트 상세 정보 로드 실패:', error);
        testDetails.value = null;
        testData.value = null;
    } finally {
        loading.value = false;
    }
};

// 선택된 테스트 카테고리 찾기
const selectedTestCategory = computed(() => {
    return testCategories.value.find(test => test.id === selectedTest.value) || null;
});

// 필터링된 테스트 목록 (현재 선택된 것 제외)
const filteredTests = computed(() => {
    return availableTests.value.filter(t => t !== selectedTest.value);
});

// 날짜 선택 시 업데이트
const updateSelectedDate = async (date: string) => {
    selectedDate.value = date;
    await loadAvailableTests();
    await loadTestDetail();
};

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
    await loadTestCategories();
});

// 날짜나 선택된 테스트가 변경될 때 데이터 로드
watch([() => selectedDate.value, () => selectedTest.value], async () => {
    if (selectedDate.value && selectedTest.value) {
        await loadTestDetail();
    }
});

// 코멘트 저장 함수
const saveComment = async () => {
    if (!selectedDate.value || !selectedTest.value || !props.patient?.id) return;

    try {
        // 현재 테스트 결과 가져오기
        const currentResult = await TestService.getTestResult(
            props.patient.id,
            selectedTest.value,
            selectedDate.value
        );

        // 코멘트만 업데이트한 객체 생성
        const updatedData = {
            ...currentResult.data,
            comment: comment.value
        };

        // 업데이트된 데이터 저장
        await TestService.saveTestResult(updatedData);
    } catch (error) {
        console.error('코멘트 저장 실패:', error);
    }
};

// 코멘트 변경 시 자동 저장 (디바운스 처리)
let saveTimeout: number | null = null;
const updateComment = () => {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }

    saveTimeout = window.setTimeout(() => {
        saveComment();
    }, 1000); // 1초 후 저장
};

// 컴포넌트 메서드 노출
defineExpose({ updateSelectedDate });
</script>

<template>
    <div v-if="selectedDate" class="bg-white p-6 shadow-lg rounded-lg flex flex-col h-full overflow-hidden">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-bold">{{ selectedDate.replace(/-/g, '.') }} 검사</h3>
            <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
        </div>

        <!-- 검사 선택 드롭다운 -->
        <div class="relative mb-4">
            <div @click="isDropdownOpen = !isDropdownOpen"
                class="border rounded px-4 py-2 cursor-pointer flex items-center justify-between">
                <span v-if="selectedTest" class="px-2 py-1 rounded text-xs font-bold" :style="{
                    backgroundColor: selectedTestCategory?.bg || '#f3f4f6',
                    color: selectedTestCategory?.color || '#111827'
                }">
                    {{ selectedTest }}
                </span>
                <span v-else class="text-gray-400">검사를 선택하세요</span>
                <span class="ml-auto">&#9662;</span>
            </div>

            <div v-if="isDropdownOpen" class="absolute w-full px-2 bg-white border shadow-md rounded-lg z-10">
                <div v-for="test in filteredTests" :key="test" @click="selectedTest = test; isDropdownOpen = false"
                    class="p-2 cursor-pointer flex items-center hover:bg-gray-100">
                    <span class="px-2 py-1 rounded text-xs font-bold" :style="{
                        backgroundColor: testCategories.find(t => t.id === test)?.bg || '#f3f4f6',
                        color: testCategories.find(t => t.id === test)?.color || '#111827'
                    }">
                        {{ test }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="loading" class="flex-grow flex justify-center items-center">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <div v-else-if="testDetails" class="flex flex-col flex-grow overflow-hidden">
            <!-- 스크롤 가능한 내용 영역 - 높이 제한하여 코멘트가 더 위로 올라오게 -->
            <div class="h-[calc(100%-150px)] overflow-auto">
                <!-- 총 그래프에서 선택된 검사만 표시 -->
                <TotalGraph v-if="selectedTest" :patient="patient" :selectedTest="selectedTest" :hideHeader="true" />

                <!-- 테스트 점수 표시 -->
                <div class="mt-4 bg-gray-50 p-2 rounded-md">
                    <p class="font-semibold text-sm">총 점수: {{ testDetails.totalScore }}</p>
                </div>

                <!-- 질문 및 응답 표시 -->
                <div class="mt-2">
                    <div v-for="(question, index) in testDetails.questionsWithAnswers" :key="index"
                        class="mb-3 p-2 bg-gray-50 rounded-md shadow-sm">
                        <p class="text-gray-800 text-xs font-medium">{{ index + 1 }}. {{ question.questionText }}</p>

                        <!-- 모든 선택 옵션 표시 -->
                        <div class="mt-1">
                            <div v-for="option in question.options" :key="option.id"
                                class="ml-4 text-xs flex items-start"
                                :class="{ 'font-semibold': option.id === question.selectedOptionId }">
                                <input type="radio" :checked="option.id === question.selectedOptionId" :disabled="true"
                                    class="mt-0.5 mr-1 h-3 w-3">
                                <span>{{ option.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 코멘트 영역 (고정 높이, 항상 화면에 보이도록) -->
            <div class="h-[130px] mt-4 border-t border-gray-200 pt-2">
                <label for="comment" class="block mb-1 text-xs font-medium text-gray-700">코멘트</label>
                <textarea id="comment" class="w-full h-[100px] border p-2 rounded text-xs" placeholder="코멘트를 써주세요."
                    v-model="comment" @input="updateComment"></textarea>
            </div>
        </div>

        <div v-else-if="selectedTest" class="flex-grow flex justify-center items-center">
            <p class="text-gray-500">해당 검사 데이터를 불러올 수 없습니다.</p>
        </div>

        <div v-else class="flex-grow flex justify-center items-center">
            <p class="text-gray-500">검사를 선택해 주세요.</p>
        </div>
    </div>

    <div v-else class="bg-white p-6 shadow-lg rounded-lg flex justify-center items-center h-full">
        <p class="text-gray-500">검사 기록에서 날짜를 선택해 주세요.</p>
    </div>
</template>