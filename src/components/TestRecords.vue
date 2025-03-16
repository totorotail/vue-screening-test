<script setup lang="ts">
import { computed, ref } from 'vue';
import { useTestStore } from '../stores/testStore';

const props = defineProps<{ patient: any }>();
const emit = defineEmits(['startTest']);

// ✅ 선택된 검사 기록 (체크박스 상태 관리)
const selectedRecords = ref<string[]>([]);

// ✅ 한 페이지에 표시할 검사 기록 수
const itemsPerPage = 5;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(formattedExamRecords.value.length / itemsPerPage));

// ✅ 현재 페이지의 검사 기록 필터링
const paginatedExamRecords = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return formattedExamRecords.value.slice(start, start + itemsPerPage);
});

// ✅ 날짜별 검사 기록을 정리하여 검사 기록 목록에 표시할 데이터 생성
const formattedExamRecords = computed(() => {
    if (!props.patient || !props.patient.examRecords) return [];

    return Object.entries(props.patient.examRecords).map(([date, exams]) => {
        const examEntries = exams as Record<string, ExamResult>;
        const examTypes = Object.keys(examEntries);
        const displayedExams = examTypes.slice(0, 4);
        const moreExams = examTypes.length > 4 ? `+${examTypes.length - 4}` : '';

        return {
            date,
            displayedExams,
            moreExams
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
});

// ✅ 페이지 이동 함수
const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// ✅ ExamResult 타입 정의
interface ExamResult {
    totalScore: number;
    responses: number[];
}

const testStore = useTestStore();
</script>

<template>
    <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col h-full">
        <div>
            <div class="flex justify-between items-center">
                <h3 class="text-lg font-bold">검사기록</h3>
                <button @click="$emit('startTest')"
                    class="px-1 py-1 border border-black text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition">
                    검사하기
                </button>
            </div>
            <hr class="my-2">
        </div>

        <!-- ✅ 리스트 영역을 flex-grow 적용하여 확장 -->
        <div class="flex-grow overflow-auto">
            <!-- ✅ 검사 기록이 없을 경우 -->
            <p v-if="paginatedExamRecords.length === 0" class="text-gray-500">검사기록이 없습니다.</p>

            <!-- ✅ 검사 기록이 있을 경우 -->
            <ul v-else>
                <li v-for="record in paginatedExamRecords" :key="record.date" class="py-3 border-b">
                    <!-- ✅ 첫 번째 줄: 체크박스 + 날짜 + '검사' -->
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" v-model="selectedRecords" :value="record.date" class="cursor-pointer">
                        <span class="text-gray-700">{{ record.date.replace(/-/g, '.') }} 검사</span>
                    </div>

                    <!-- ✅ 두 번째 줄: 검사 종류 (들여쓰기 추가) -->
                    <div class="ml-5 flex flex-wrap items-center gap-2 mt-1">
                        <span v-for="exam in record.displayedExams" :key="exam"
                            class="px-2 py-1 rounded text-xs font-bold"
                            :class="[testStore.testCategories.find(test => test.id === exam)?.bg || 'bg-gray-200',
                            testStore.testCategories.find(test => test.id === exam)?.color || 'text-gray-800']">
                            {{ exam }}
                        </span>
                        <span v-if="record.moreExams" class="text-sm font-semibold text-gray-600">
                            {{ record.moreExams }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- ✅ 페이지네이션 -->
        <div class="mt-auto flex justify-center space-x-1">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-3 py-2 border rounded disabled:opacity-50">
                &lt;
            </button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                class="px-4 py-2 border rounded"
                :class="{ 'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-200': page !== currentPage }">
                {{ page }}
            </button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-3 py-2 border rounded disabled:opacity-50">
                &gt;
            </button>
        </div>
    </div>
</template>
