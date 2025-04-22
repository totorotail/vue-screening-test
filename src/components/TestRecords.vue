<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue';
import TestService from '../services/TestService';

const props = defineProps<{ patient: any }>();
const emit = defineEmits(['startTest', 'recordSelected']);

// 선택된 검사 기록 (체크박스 상태 관리)
const selectedRecord = ref<string | null>(null);

// 검사 카테고리 정보 저장
const testCategories = ref<any[]>([]);

// 검사 기록 데이터
const examRecordSummary = ref<any[]>([]);
const loading = ref(false);

// 한 페이지에 표시할 검사 기록 수
const itemsPerPage = 5;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(examRecordSummary.value.length / itemsPerPage));

// 현재 페이지의 검사 기록 필터링
const paginatedExamRecords = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return examRecordSummary.value.slice(start, start + itemsPerPage);
});

// 검사 카테고리 정보 로드
const loadTestCategories = async () => {
    try {
        const response = await TestService.getAllTests();
        testCategories.value = response.data.map((test: any) => ({
            id: test.acronym,
            name: test.title,
            bg: test.badgeBgColor,
            color: test.badgeTextColor
        }));
    } catch (error) {
        console.error('검사 카테고리 로드 실패:', error);
    }
};

// 검사 기록 요약 로드
const loadTestHistorySummary = async () => {
    if (!props.patient || !props.patient.id) return;

    loading.value = true;
    try {
        const response = await TestService.getPatientTestHistorySummary(props.patient.id);
        examRecordSummary.value = response.data.map((record: any) => ({
            date: record.testDate,
            displayedExams: record.testAcronyms.slice(0, 4),
            moreExams: record.testAcronyms.length > 4 ? `+${record.testAcronyms.length - 4}` : ''
        }));
    } catch (error) {
        console.error('검사 기록 요약 로드 실패:', error);
        examRecordSummary.value = [];
    } finally {
        loading.value = false;
    }
};

// 환자 ID가 변경될 때 데이터 로드
watch(
    () => props.patient?.id,
    (newId) => {
        if (newId) {
            loadTestHistorySummary();
        }
    },
    { immediate: true }
);

// 페이지 로드 시 데이터 가져오기
onMounted(async () => {
    await loadTestCategories();
    if (props.patient?.id) {
        await loadTestHistorySummary();
    }
});

// 페이지 이동 함수
const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// 검사 기록 선택 시 처리
const selectRecord = (date: string) => {
    selectedRecord.value = date;
    emit('recordSelected', date);
};

// 테스트 카테고리 찾기
const findTestCategory = (acronym: string) => {
    return testCategories.value.find(test => test.id === acronym) || {
        bg: '#f3f4f6',
        color: '#111827'
    };
};
</script>

<template>
    <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col h-full">
        <div>
            <div class="flex justify-between items-center">
                <h3 class="text-base font-bold">검사기록</h3> <!-- 검사기록 글자 크기 축소 -->
                <button @click="$emit('startTest')"
                    class="px-2 py-0.5 border border-black text-black text-xs font-semibold rounded-lg hover:bg-gray-100 transition">
                    검사하기 <!-- 검사하기 글자 및 버튼 크기 축소 -->
                </button>
            </div>
            <hr class="my-2">
        </div>

        <!-- 로딩 표시 -->
        <div v-if="loading" class="flex-grow flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- 리스트 영역을 flex-grow 적용하여 확장 -->
        <div v-else class="flex-grow overflow-auto">
            <!-- 검사 기록이 없을 경우 -->
            <p v-if="paginatedExamRecords.length === 0" class="text-gray-500 text-xs">검사기록이 없습니다.</p>

            <!-- 검사 기록이 있을 경우 -->
            <ul v-else>
                <li v-for="record in paginatedExamRecords" :key="record.date" @click="selectRecord(record.date)"
                    class="py-3 border-b cursor-pointer hover:bg-gray-50">
                    <!-- 첫 번째 줄: 체크박스 + 날짜 + '검사' -->
                    <div class="flex items-center space-x-2">
                        <input type="radio" v-model="selectedRecord" :value="record.date" class="cursor-pointer">
                        <span class="text-gray-700 text-s">{{ record.date.replace(/-/g, '.') }} 검사</span>
                        <!-- 날짜 글자 크기 축소 -->
                    </div>

                    <!-- 두 번째 줄: 검사 종류 (들여쓰기 추가) -->
                    <div class="ml-5 flex flex-wrap items-center gap-2 mt-1">
                        <span v-for="exam in record.displayedExams" :key="exam"
                            class="px-2 py-0.5 rounded text-[10px] font-bold" :style="{
                                backgroundColor: findTestCategory(exam).bg,
                                color: findTestCategory(exam).color
                            }">
                            {{ exam }}
                        </span>
                        <span v-if="record.moreExams" class="text-xs font-semibold text-gray-600">
                            {{ record.moreExams }}
                        </span>
                    </div>
                </li>
            </ul>
        </div>

        <!-- 페이지네이션 -->
        <div v-if="totalPages > 1" class="mt-auto flex justify-center space-x-1 py-2">
            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                class="px-2 py-1 border rounded text-xs disabled:opacity-50">
                &lt;
            </button>

            <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                class="px-3 py-1 border rounded text-xs"
                :class="{ 'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-200': page !== currentPage }">
                {{ page }}
            </button>

            <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                class="px-2 py-1 border rounded text-xs disabled:opacity-50">
                &gt;
            </button>
        </div>
    </div>
</template>