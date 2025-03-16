<script setup lang="ts">
import { computed, ref, watch, toRaw, nextTick } from 'vue';
import { GChart } from 'vue-google-charts';
import { useTestStore } from '../stores/testStore';

const props = defineProps<{ patient: any, selectedTest?: string }>();

const testStore = useTestStore();

// ✅ `chartData`를 반응형 객체로 선언
const chartData = ref<Record<string, Array<[Date, number]>>>({});
const chartReady = ref(false);

// ✅ 검사 데이터 변환 함수
const getRecentExamData = (testId: string): [Date, number][] => {
    if (!props.patient?.examRecords) return [[new Date("2000-01-01"), 0]];

    const filteredRecords: [Date, number][] = Object.entries(toRaw(props.patient.examRecords))
        .filter(([date, exams]) => (exams as Record<string, ExamResult>)[testId] !== undefined)
        .map(([date, exams]) => {
            const examData = (exams as Record<string, ExamResult>)[testId];

            // ✅ Date 객체 변환 및 점수 데이터 변환을 명확히 정의
            const formattedDate = new Date(`20${date.replace(/\./g, "-")}`);
            const score = Number(examData?.totalScore ?? 0); // 숫자로 변환

            return [formattedDate, score] as [Date, number];
        })
        .sort((a, b) => a[0].getTime() - b[0].getTime()) // ✅ 날짜 오름차순 정렬
        .slice(-5); // ✅ 최신 5개 데이터 유지

    return filteredRecords.length > 0 ? filteredRecords : [[new Date("2000-01-01"), 0]];
};

// ✅ `patient.examRecords`가 변경될 때 차트 업데이트
watch(
    () => props.patient?.examRecords,
    async () => {
        if (!props.patient?.examRecords) return;

        const newChartData: Record<string, Array<[Date, number]>> = {};

        testStore.testCategories.forEach((test) => {
            const data = getRecentExamData(test.id);
            if (data.length > 0) newChartData[test.id] = data;
        });

        chartData.value = newChartData; // ✅ 한 번에 갱신
        await nextTick();
        chartReady.value = true;
    },
    { immediate: true, deep: true }
);

// ✅ Google Charts 옵션
const chartOptions = computed(() => ({
    title: '',
    curveType: 'function',
    legend: { position: 'bottom' },
    hAxis: {
        title: '날짜',
        format: 'yyyy-MM-dd',
        textStyle: { fontSize: 12 }
    },
    vAxis: {
        title: '점수',
        minValue: 0,
        maxValue: Math.max(
            20,
            ...Object.values(chartData.value || {})
                .flat()
                .map((row) => (typeof row[1] === "number" ? row[1] : 0))
        )
    },
    chartArea: { width: '85%', height: '70%' },
    backgroundColor: '#ffffff'
}));

// ✅ `chartData[graph.id]`가 `undefined`일 경우 빈 배열 반환
const safeChartData = (graphId: string) => chartData.value?.[graphId] ?? [["날짜", "점수"], [new Date(), 0]];

// ✅ 선택된 검사만 필터링하여 표시 (없으면 모든 검사 표시)
const filteredGraphs = computed(() => {
    return props.selectedTest
        ? testStore.testCategories.filter(test => test.id === props.selectedTest)
        : testStore.testCategories;
});

// ✅ ExamResult 타입 직접 정의
interface ExamResult {
    totalScore: number;
    responses: number[];
}
</script>

<template>
    <div>
        <h3 class="text-lg font-bold">총 그래프</h3>
        <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>

        <div class="overflow-y-scroll max-h-[500px]">
            <div v-for="graph in filteredGraphs" :key="graph.id" class="border p-4 mb-2 rounded-lg">
                <div class="flex items-center space-x-2">
                    <span class="px-2 py-1 rounded text-xs font-bold" :class="[
                        testStore.testCategories.find(test => test.id === graph.id)?.bg || 'bg-gray-200',
                        testStore.testCategories.find(test => test.id === graph.id)?.color || 'text-gray-800'
                    ]">
                        {{ graph.id }}
                    </span>
                    <p class="text-sm font-semibold">{{ graph.name }}</p>
                </div>

                <!-- ✅ Google Charts를 사용하여 그래프 표시 -->
                <div class="h-32 w-full">
                    <GChart v-if="chartReady && safeChartData(graph.id).length > 1"
                        :key="graph.id + '-' + safeChartData(graph.id).length" type="LineChart"
                        :data="[['날짜', '점수'], ...safeChartData(graph.id)]" :options="chartOptions"
                        class="w-full h-40" />
                    <p v-else class="text-gray-500 text-sm text-center">데이터 없음</p>
                </div>

                <!-- ✅ 최근 데이터가 있는 경우, 최신 검사 날짜 표시 -->
                <p v-if="chartData[graph.id]?.length > 1" class="text-sm text-gray-500 text-right mt-1">
                    날짜: {{ chartData[graph.id]?.slice(-1)[0][0] }}
                </p>
            </div>
        </div>
    </div>
</template>

