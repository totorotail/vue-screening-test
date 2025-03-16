<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTestDetailsStore } from '../stores/testDetailsStore';
import TotalGraph from '../components/TotalGraph.vue';

const props = defineProps<{ patient: any }>();
const testDetailsStore = useTestDetailsStore();

const selectedDate = ref<string | null>(null);
const selectedTest = ref<string>(''); // ✅ 초기값을 빈 문자열로 설정

// ✅ 선택 가능한 검사 목록
const availableTests = computed<string[]>(() => {
    if (!selectedDate.value || !props.patient?.examRecords) return [];
    return Object.keys(props.patient.examRecords[selectedDate.value] || {});
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
        <h3 class="text-lg font-bold">{{ selectedDate.replace(/-/g, '.') }} 검사</h3>

        <!-- ✅ 검사 선택 -->
        <select v-model="selectedTest" class="border px-2 py-1 rounded mt-2 w-full">
            <option v-for="test in availableTests" :key="test" :value="test">
                {{ test }}
            </option>
        </select>

        <!-- ✅ 총 그래프에서 선택된 검사만 표시 -->
        <TotalGraph v-if="selectedTest" :patient="patient" :selectedTest="selectedTest" />

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
