<script setup lang="ts">
import { computed, ref, onMounted, watch, onBeforeUnmount } from 'vue';
import TestService from '../services/TestService';

const props = defineProps<{ patient: any }>();
const emit = defineEmits(['startTest', 'recordSelected']);

const selectedRecord = ref<string | null>(null);
const testCategories = ref<any[]>([]);
const examRecordSummary = ref<any[]>([]);
const loading = ref(false);

// 동적으로 조정되는 페이지당 아이템 수
const itemsPerPage = ref(9);
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(examRecordSummary.value.length / itemsPerPage.value));

const paginatedExamRecords = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return examRecordSummary.value.slice(start, start + itemsPerPage.value);
});

// 컨테이너와 아이템 높이 참조
const containerRef = ref<HTMLElement | null>(null);
const itemHeight = 65; // 대략적인 아이템 한 개의 높이 (px)

// 화면 크기에 따라 동적으로 itemsPerPage 조정
const updateItemsPerPage = () => {
    if (!containerRef.value) return;

    // 컨테이너 높이에서 페이지네이션 높이를 뺀 값
    const availableHeight = containerRef.value.clientHeight - 44;

    // 가능한 아이템 수 계산 (최소 3개)
    const possibleItems = Math.max(3, Math.floor(availableHeight / itemHeight));

    // 현재 아이템 수와 다를 경우에만 업데이트
    if (possibleItems !== itemsPerPage.value) {
        itemsPerPage.value = possibleItems;

        // 현재 페이지 유효성 검사
        if (currentPage.value > totalPages.value && totalPages.value > 0) {
            currentPage.value = totalPages.value;
        }
    }
};

// 창 크기 변경 이벤트 리스너
const handleResize = () => {
    updateItemsPerPage();
};

onMounted(() => {
    loadTestCategories();
    if (props.patient?.id) loadTestHistorySummary();

    // 초기 itemsPerPage 설정 및 리사이즈 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    // DOM이 업데이트된 후 초기 계산
    setTimeout(() => {
        updateItemsPerPage();
    }, 0);
});

onBeforeUnmount(() => {
    // 컴포넌트 제거 시 이벤트 리스너 제거
    window.removeEventListener('resize', handleResize);
});

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

const loadTestHistorySummary = async () => {
    if (!props.patient?.id) return;
    loading.value = true;
    try {
        const response = await TestService.getPatientTestHistorySummary(props.patient.id);
        examRecordSummary.value = response.data.map((record: any) => ({
            date: record.testDate,
            displayedExams: record.testAcronyms.slice(0, 4),
            moreExams: record.testAcronyms.length > 4 ? `+${record.testAcronyms.length - 4}` : ''
        }));

        // 데이터 로드 후 itemsPerPage 업데이트
        updateItemsPerPage();
    } catch (error) {
        console.error('검사 기록 요약 로드 실패:', error);
        examRecordSummary.value = [];
    } finally {
        loading.value = false;
    }
};

watch(() => props.patient?.id, (newId) => {
    if (newId) loadTestHistorySummary();
}, { immediate: true });

const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) currentPage.value = page;
};

const selectRecord = (date: string) => {
    selectedRecord.value = date;
    emit('recordSelected', date);
};

const findTestCategory = (acronym: string) => {
    return testCategories.value.find(test => test.id === acronym) || {
        bg: '#f3f4f6',
        color: '#111827'
    };
};
</script>

<template>
    <div class="bg-white p-6 shadow-lg rounded-lg flex flex-col h-full">
        <!-- 헤더 -->
        <div class="flex justify-between items-center">
            <h3 class="text-base font-bold">검사기록</h3>
            <button @click="$emit('startTest')"
                class="px-2 py-0.5 border border-black text-black text-xs font-semibold rounded-lg hover:bg-gray-100 transition">
                검사하기
            </button>
        </div>
        <hr class="my-2" />

        <!-- 로딩 -->
        <div v-if="loading" class="flex-grow flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- 리스트 + 페이지네이션 -->
        <div v-else class="flex flex-col flex-grow" ref="containerRef">
            <!-- 리스트 (고정 높이) -->
            <div class="h-[calc(100%-44px)] overflow-hidden">
                <ul v-if="paginatedExamRecords.length > 0" class="divide-y divide-gray-200 h-full">
                    <li v-for="record in paginatedExamRecords" :key="record.date" @click="selectRecord(record.date)"
                        class="py-3 cursor-pointer hover:bg-gray-50 flex flex-col justify-center">
                        <div class="flex items-center space-x-2">
                            <input type="radio" v-model="selectedRecord" :value="record.date" class="cursor-pointer" />
                            <span class="text-sm">{{ record.date.replace(/-/g, '.') }} 검사</span>
                        </div>
                        <div class="ml-5 flex flex-wrap items-center gap-2 mt-1">
                            <span v-for="exam in record.displayedExams" :key="exam"
                                class="px-2 py-0.5 rounded text-[10px] font-bold"
                                :style="{ backgroundColor: findTestCategory(exam).bg, color: findTestCategory(exam).color }">
                                {{ exam }}
                            </span>
                            <span v-if="record.moreExams" class="text-xs font-semibold text-gray-600">
                                {{ record.moreExams }}
                            </span>
                        </div>
                    </li>
                </ul>
                <div v-else class="text-gray-500 text-xs h-full flex items-center justify-center">
                    검사기록이 없습니다.
                </div>
            </div>

            <!-- 페이지네이션 -->
            <div class="min-h-[44px] flex justify-center items-center pt-2 space-x-6">
                <!-- 이전 화살표 버튼 -->
                <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                    class="w-5 h-5 flex items-center justify-center border rounded-md text-xs">
                    &lt;
                </button>

                <!-- 페이지 숫자 버튼 -->
                <div class="flex space-x-3">
                    <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
                        class="w-5 h-5 text-xs flex items-center justify-center rounded-md" :class="{
                            'bg-black text-white': page === currentPage,
                            'hover:text-black': page !== currentPage
                        }">
                        {{ page }}
                    </button>
                </div>

                <!-- 다음 화살표 버튼 -->
                <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="w-5 h-5 flex items-center justify-center border rounded-md text-xs">
                    &gt;
                </button>
            </div>
        </div>
    </div>
</template>