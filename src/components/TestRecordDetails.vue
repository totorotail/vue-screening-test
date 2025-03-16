<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTestDetailsStore } from '../stores/testDetailsStore';
import { useTestStore } from '../stores/testStore';
import TotalGraph from '../components/TotalGraph.vue';

const testStore = useTestStore();
const isDropdownOpen = ref(false);
const props = defineProps<{ patient: any }>();
const testDetailsStore = useTestDetailsStore();

const selectedDate = ref<string | null>(null);
const selectedTest = ref<string>(''); // ✅ 초기값을 빈 문자열로 설정

// ✅ 선택 가능한 검사 목록
const availableTests = computed<string[]>(() => {
    if (!selectedDate.value || !props.patient?.examRecords) return [];
    return Object.keys(props.patient.examRecords[selectedDate.value] || {});
});

const filteredTests = computed(() => {
    return availableTests.value.filter(t => t !== selectedTest.value);
});

// ✅ 현재 선택된 검사 데이터 가져오기
const selectedTestData = computed(() => {
    if (!selectedDate.value || !selectedTest.value || !props.patient?.examRecords) return null;
    return props.patient.examRecords[selectedDate.value]?.[selectedTest.value] || null;
});

// ✅ 검사 정보 가져오기 (testDetailsStore에서 안전하게 접근)
const selectedTestDetails = computed(() => {
    return testDetailsStore.testDetails[selectedTest.value as keyof typeof testDetailsStore.testDetails] || null;
});

// ✅ 검사 기록에서 날짜 선택 시 업데이트
const updateSelectedDate = (date: string) => {
    selectedDate.value = date;
    selectedTest.value = availableTests.value.length > 0 ? availableTests.value[0] : ''; // ✅ 첫 번째 검사 선택
};

defineExpose({ updateSelectedDate });
</script>

<template>
    <div v-if="selectedDate" class="bg-white p-6 shadow-lg rounded-lg">
        <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-bold">{{ selectedDate.replace(/-/g, '.') }} 검사</h3>
            <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
        </div>

        <!-- ✅ 검사 선택 -->
        <div class="relative">
            <!-- ✅ 현재 선택된 값 -->
            <div @click="isDropdownOpen = !isDropdownOpen"
                class="border rounded px-4 py-2 cursor-pointer flex items-center justify-between">
                <span v-if="selectedTest" class="px-2 py-1 rounded text-xs font-bold" :class="[testStore.testCategories.find(test => test.id === selectedTest)?.bg || 'bg-gray-200',
                testStore.testCategories.find(test => test.id === selectedTest)?.color || 'text-gray-800']">
                    {{ selectedTest }}
                </span>
                <span v-else class="text-gray-400">검사를 선택하세요</span>
                <span class="ml-auto">&#9662;</span>
            </div>

            <!-- ✅ 옵션 리스트 -->
            <div v-if="isDropdownOpen" class="absolute w-full mt-1 bg-white border shadow-md rounded-lg z-10">
                <div v-for="test in filteredTests" :key="test" @click="selectedTest = test; isDropdownOpen = false"
                    class="p-2 cursor-pointer flex items-center hover:bg-gray-100">

                    <!-- ✅ 선택 가능한 검사 옵션 스타일 적용 -->
                    <span class="px-2 py-1 rounded text-xs font-bold" :class="[testStore.testCategories.find(t => t.id === test)?.bg || 'bg-gray-200',
                    testStore.testCategories.find(t => t.id === test)?.color || 'text-gray-800']">
                        {{ test }}
                    </span>
                </div>
            </div>
        </div>


        <!-- ✅ 총 그래프에서 선택된 검사만 표시 -->
        <TotalGraph v-if="selectedTest" :patient="patient" :selectedTest="selectedTest" :hideHeader="true" />

        <!-- ✅ 설명 및 질문 목록 -->
        <p v-if="selectedTestDetails" class="text-gray-700 text-sm mt-4">
            {{ selectedTestDetails.description || "설명이 없습니다." }}
        </p>

        <!-- ✅ 질문 및 응답 표시 -->
        <div v-if="selectedTestData && selectedTestDetails" class="mt-4">
            <div v-for="(question, index) in selectedTestDetails.questions" :key="index" class="mb-2">
                <p class="text-gray-800">{{ index + 1 }}. {{ question.text }}</p>
                <p class="text-gray-600">선택한 답변: {{ selectedTestData.responses[index] }}</p>
            </div>
        </div>

        <!-- ✅ 코멘트 입력 -->
        <textarea class="w-full border p-2 mt-4 rounded" placeholder="코멘트를 써주세요."></textarea>
    </div>
</template>
