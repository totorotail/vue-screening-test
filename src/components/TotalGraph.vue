<script setup lang="ts">
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import type { ChartData, ChartOptions } from 'chart.js';
import TestService from '../services/TestService';

// Chart.js 컴포넌트 등록
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const props = defineProps<{ patient: any, selectedTest?: string, hideHeader?: boolean }>();

// chartData를 반응형 객체로 선언
const chartData = ref<Record<string, ChartData<'line'>>>({});
const loading = ref(false);
// 검사 카테고리 저장
const testCategories = ref<any[]>([]);

// 선택된 검사만 필터링
const filteredTests = computed(() => {
    return props.selectedTest
        ? testCategories.value.filter(test => test.id === props.selectedTest)
        : testCategories.value;
});

// 검사 정보 로드
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
        console.error("검사 정보 로드 실패:", error);
    }
};

onMounted(() => {
    loadTestCategories();
    if (props.patient?.id) {
        loadChartData();
    }
});

// 날짜 포맷 함수 - 'yy.MM.dd' 형식으로 변환
const formatDate = (dateInput: string | number): string => {
    if (!dateInput) return '';
    const dateString = String(dateInput);
    return dateString.substring(2).replace(/-/g, '.');
};

// 검사 데이터와 날짜 매핑 저장을 위한 변수
const dateMapping = ref<Record<string, string[]>>({});

// 검사 스코어 히스토리 데이터 가져오기
const getTestScoreHistory = async (testId: string): Promise<any[]> => {
    try {
        const result = await TestService.getPatientTestScoreHistory(props.patient.id, testId);
        return result.data;
    } catch (error) {
        console.error(`${testId} 검사 스코어 히스토리 조회 실패:`, error);
        return [];
    }
};

// 검사 데이터 처리 함수
const processExamData = (testId: string, historyData: any[]): void => {
    // 매핑 배열 초기화
    dateMapping.value[testId] = Array(5).fill('');

    // 기본 데이터 구조 생성
    chartData.value[testId] = {
        labels: ['', '', '', '', ''],
        datasets: [
            {
                label: testId,
                data: [null, null, null, null, null],
                borderColor: '#4285F4',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                pointBackgroundColor: '#4285F4',
                pointRadius: 4,
                tension: 0,
                fill: true
            }
        ]
    };

    // 데이터가 없는 경우 빈 차트 데이터 반환
    if (!historyData || historyData.length === 0) {
        return;
    }

    // 날짜 오름차순 정렬
    historyData.sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());

    // 최신 5개만 가져오기
    const recentRecords = historyData.slice(-5);

    // 데이터 가공
    const labels = ['', '', '', '', ''];
    const scoreData: (number | null)[] = [null, null, null, null, null];

    if (recentRecords.length === 5) {
        // 5개 모두 있을 경우
        for (let i = 0; i < 5; i++) {
            labels[i] = formatDate(recentRecords[i].testDate);
            scoreData[i] = recentRecords[i].totalScore;
            dateMapping.value[testId][i] = recentRecords[i].testDate;
        }
    } else {
        // 실제 데이터 채우기 (뒤쪽부터)
        for (let i = 0; i < recentRecords.length; i++) {
            const index = 5 - recentRecords.length + i;
            labels[index] = formatDate(recentRecords[i].testDate);
            scoreData[index] = recentRecords[i].totalScore;
            dateMapping.value[testId][index] = recentRecords[i].testDate;
        }
    }

    // Chart.js 데이터 포맷으로 변환
    chartData.value[testId] = {
        labels: labels,
        datasets: [
            {
                label: testId,
                data: scoreData,
                borderColor: '#4285F4',
                backgroundColor: 'rgba(66, 133, 244, 0.1)',
                pointBackgroundColor: '#4285F4',
                pointRadius: 4,
                tension: 0,
                fill: true
            }
        ]
    };
};

// 각 그래프의 날짜 레이블 생성
const getDateLabels = (testId: string): { text: string, index: number }[] => {
    if (!dateMapping.value[testId]) return [];

    const result: { text: string, index: number }[] = [];

    for (let i = 0; i < dateMapping.value[testId].length; i++) {
        const date = dateMapping.value[testId][i];
        if (date) {
            result.push({
                text: formatDate(date),
                index: i
            });
        }
    }

    return result;
};

// 차트 데이터 로딩
const loadChartData = async () => {
    if (!props.patient || !props.patient.id) return;

    loading.value = true;
    try {
        // 테스트 카테고리가 로드되지 않았다면 로드
        if (testCategories.value.length === 0) {
            await loadTestCategories();
        }

        // 기존 데이터 초기화
        chartData.value = {};

        // 선택된 테스트가 있는 경우 해당 테스트만 로드
        if (props.selectedTest) {
            const historyData = await getTestScoreHistory(props.selectedTest);
            processExamData(props.selectedTest, historyData);
        } else {
            // 모든 테스트 카테고리에 대해 데이터 로드
            for (const test of testCategories.value) {
                const historyData = await getTestScoreHistory(test.id);
                processExamData(test.id, historyData);
            }
        }

        await nextTick();
    } catch (error) {
        console.error("차트 데이터 로딩 실패:", error);
    } finally {
        loading.value = false;
    }
};

// patient 변경 시 차트 업데이트
watch(
    () => props.patient?.id,
    async (newId) => {
        if (newId) {
            await loadChartData();
        }
    },
    { immediate: true }
);

// selectedTest 변경 시 해당 테스트만 업데이트
watch(
    () => props.selectedTest,
    async (newTestId) => {
        if (newTestId && props.patient?.id) {
            const shouldReload = !chartData.value[newTestId];
            if (shouldReload) {
                await loadChartData();
            }
        }
    }
);

// Chart.js 옵션
const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        y: {
            beginAtZero: true,
            max: 80,
            ticks: {
                stepSize: 20
            },
            grid: {
                color: '#e0e0e0'
            }
        },
        x: {
            grid: {
                color: '#e0e0e0'
            },
            ticks: {
                display: false  // x축 라벨은 별도로 표시하므로 숨김
            }
        }
    },
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            callbacks: {
                title: () => {
                    return '';  // 툴팁 제목 비움
                },
                label: (context) => {
                    const label = context.dataset.label || '';
                    const value = context.parsed.y;
                    const index = context.dataIndex;

                    // Object is possibly 'undefined' 에러 해결
                    const chartItem = chartData.value[label];
                    if (!chartItem) return '';

                    const dateLabel = chartItem.labels?.[index];
                    if (!dateLabel || value === null) return '';

                    return `날짜: ${dateLabel}, 점수: ${value}`;
                }
            }
        }
    }
};

// 날짜 레이블 위치 조정 함수
const adjustLabelPosition = (index: number, totalLabels: number): number => {
    // 기본 위치 계산
    let position = index * 25;

    // 첫 번째 라벨은 약간 오른쪽으로 이동
    if (index === 0 && totalLabels > 1) {
        position = 5;
    }

    // 마지막 라벨은 약간 왼쪽으로 이동
    if (index === 4 || (totalLabels > 0 && index === totalLabels - 1 && index > 0)) {
        position = 95;
    }

    return position;
};
</script>

<template>
    <div>
        <!-- hideHeader가 false일 때만 제목과 버튼을 표시 - 항상 고정 -->
        <div v-if="!hideHeader" class="flex justify-between items-center mb-2 sticky top-0 bg-white z-10">
            <h3 class="text-lg font-bold">총 그래프</h3>
            <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
        </div>

        <div v-if="loading" class="flex justify-center items-center h-40">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
        </div>

        <!-- 검사 그래프 영역 - 스크롤 가능하게 설정 -->
        <div v-else class="overflow-auto max-h-[calc(100%-20px)]">
            <div v-for="graph in filteredTests" :key="graph.id" class="p-4 mb-2">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 rounded text-xs font-bold" :style="{
                        backgroundColor: graph.bg || '#f3f4f6',
                        color: graph.color || '#111827'
                    }">
                        {{ graph.id }}
                    </span>
                    <p class="text-sm font-semibold">{{ graph.name }}</p>
                </div>

                <!-- 그래프 컨테이너 -->
                <div class="relative h-[180px] w-full">
                    <!-- Chart.js 라인 차트 -->
                    <Line v-if="chartData[graph.id]" :data="chartData[graph.id]" :options="chartOptions"
                        class="w-full h-full" />

                    <!-- 날짜 레이블 -->
                    <div class="absolute bottom-0 w-full">
                        <template v-for="label in getDateLabels(graph.id)" :key="label.text">
                            <span
                                :style="`position: absolute; bottom: -20px; left: ${adjustLabelPosition(label.index, getDateLabels(graph.id).length)}%; transform: translateX(-50%);`"
                                class="text-xs text-black">
                                {{ label.text }}
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>