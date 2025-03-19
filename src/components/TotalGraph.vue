<script setup lang="ts">
import { computed, ref, watch, toRaw, nextTick } from 'vue';
import { GChart } from 'vue-google-charts';
import { useTestStore } from '../stores/testStore';

const props = defineProps<{ patient: any, selectedTest?: string, hideHeader?: boolean }>();

const testStore = useTestStore();

// ✅ chartData를 반응형 객체로 선언
const chartData = ref<Record<string, any[]>>({});
const chartReady = ref(false);

// ✅ 날짜 포맷 함수 - 'yy.MM.dd' 형식으로 변환
const formatDate = (dateInput: string | number): string => {
    const dateString = String(dateInput);
    // 날짜 포맷이 '2024-11-31' 형식이므로 '24.11.31' 형식으로 변환
    return dateString.substring(2).replace(/-/g, '.');
};

// ✅ 날짜 레이블 위치 조정 함수
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

// ✅ 테스트에 데이터가 있는지 확인하는 함수
const hasData = (testId: string): boolean => {
    if (!props.patient?.examRecords) return false;

    for (const date in props.patient.examRecords) {
        const exams = props.patient.examRecords[date];
        if (exams && exams[testId]) {
            return true;
        }
    }

    return false;
};

// ✅ 검사 데이터와 날짜 매핑 저장을 위한 변수
const dateMapping = ref<Record<string, string[]>>({});

// ✅ 검사 데이터 변환 함수
const getRecentExamData = (testId: string): any[] => {
    // 기본 결과 배열 - 두 번째 컬럼 이름을 Value로 설정
    const result: any[] = [['x', 'Value', { role: 'tooltip', type: 'string', p: { html: true } }]];

    // 매핑 배열 초기화
    dateMapping.value[testId] = Array(5).fill('');

    // 환자 데이터가 없는 경우
    if (!props.patient?.examRecords) {
        // 빈 데이터 5개 추가
        for (let i = 0; i < 5; i++) {
            result.push([i, null, '']);
        }
        return result;
    }

    // 타입 정의
    interface RecordItem {
        date: string;
        score: number;
    }

    // 해당 검사가 있는 날짜와 점수 추출
    const filteredRecords: RecordItem[] = [];
    const examRecords = toRaw(props.patient.examRecords);

    for (const date in examRecords) {
        const exams = examRecords[date];
        if (exams && exams[testId]) {
            const examData = exams[testId];
            const score = Number(examData?.totalScore ?? 0);
            filteredRecords.push({ date, score });
        }
    }

    // 검사 데이터가 없는 경우
    if (filteredRecords.length === 0) {
        // 빈 데이터 5개 추가
        for (let i = 0; i < 5; i++) {
            result.push([i, null, '']);
        }
        return result;
    }

    // 날짜 오름차순 정렬
    filteredRecords.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // 최신 5개만 가져오기
    const recentRecords = filteredRecords.slice(-5);

    // 데이터 처리
    if (recentRecords.length === 5) {
        // 5개 모두 있을 경우 - 각 위치에 배치
        for (let i = 0; i < 5; i++) {
            const formattedDate = formatDate(recentRecords[i].date);
            dateMapping.value[testId][i] = recentRecords[i].date;
            const tooltip = `<div style="padding: 8px; min-width: 120px; background-color: white; border: 1px solid #ccc; box-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                <div style="font-size: 12px; margin: 2px 0;">• 날짜 : ${formattedDate}</div>
                <div style="font-size: 12px; margin: 2px 0;">• 점수 : ${recentRecords[i].score}</div>
              </div>`;
            result.push([i, recentRecords[i].score, tooltip]);
        }
    } else {
        // 빈 데이터로 초기화
        const scores = Array(5).fill(null);

        // 실제 데이터 채우기 (뒤쪽에 집중)
        for (let i = 0; i < recentRecords.length; i++) {
            const index = 5 - recentRecords.length + i;
            scores[index] = recentRecords[i].score;
            dateMapping.value[testId][index] = recentRecords[i].date;
        }

        // 데이터 추가
        for (let i = 0; i < 5; i++) {
            const tooltip = scores[i] !== null
                ? `<div style="padding: 8px; min-width: 120px; background-color: white; border: 1px solid #ccc; box-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                    <div style="font-size: 12px; margin: 2px 0;">• 날짜 : ${formatDate(dateMapping.value[testId][i])}</div>
                    <div style="font-size: 12px; margin: 2px 0;">• 점수 : ${scores[i]}</div>
                  </div>`
                : '';
            result.push([i, scores[i], tooltip]);
        }
    }

    return result;
};

// ✅ 각 그래프의 날짜 레이블 생성
const getDateLabels = (testId: string): { text: string, index: number }[] => {
    if (!props.patient?.examRecords) return [];

    const filteredDates: string[] = [];
    const examRecords = toRaw(props.patient.examRecords);

    for (const date in examRecords) {
        const exams = examRecords[date];
        if (exams && exams[testId]) {
            filteredDates.push(date);
        }
    }

    // 날짜 오름차순 정렬
    filteredDates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // 최신 5개만 가져오기
    const recentDates = filteredDates.slice(-5);
    const result: { text: string, index: number }[] = [];

    if (recentDates.length === 5) {
        // 5개 모두 있을 경우
        for (let i = 0; i < 5; i++) {
            result.push({
                text: formatDate(recentDates[i]),
                index: i
            });
        }
    } else {
        // 5개 미만일 경우 - 뒤쪽에 배치
        for (let i = 0; i < recentDates.length; i++) {
            const index = 5 - recentDates.length + i;
            result.push({
                text: formatDate(recentDates[i]),
                index: index
            });
        }
    }

    return result;
};

// ✅ patient.examRecords가 변경될 때 차트 업데이트
watch(
    () => props.patient?.examRecords,
    async () => {
        if (!props.patient?.examRecords) return;

        const newChartData: Record<string, any[]> = {};

        testStore.testCategories.forEach((test) => {
            newChartData[test.id] = getRecentExamData(test.id);
        });

        chartData.value = newChartData;
        await nextTick();
        chartReady.value = true;
    },
    { immediate: true, deep: true }
);

// ✅ Google Charts 옵션 - 하늘색 영역 채우기 추가
const chartOptions = computed(() => ({
    title: '',
    curveType: 'none',
    legend: { position: 'none' },
    tooltip: {
        isHtml: true, // HTML 툴팁 활성화
        trigger: 'focus', // 호버와 선택 모두에서 툴팁 표시
        showColorCode: false,
        textStyle: {
            fontSize: 12
        }
    },
    focusTarget: 'datum', // 개별 데이터 포인트에 포커스
    hAxis: {
        title: '',
        textStyle: {
            fontSize: 10,
            color: 'transparent' // 글자색을 투명하게 하여 숫자는 보이지 않게 함
        },
        viewWindow: {
            min: -0.1,
            max: 4.1
        },
        gridlines: {
            color: '#e0e0e0', // 연한 회색 세로선
            count: 5
        },
        ticks: [0, 1, 2, 3, 4], // ticks 유지하여 그리드라인 표시
        baselineColor: '#000000'
    },
    vAxis: {
        title: '',
        viewWindow: {
            min: 0,
            max: 80
        },
        gridlines: {
            color: '#e0e0e0', // 연한 회색 수평선
        },
        ticks: [0, 20, 40, 60, 80], // 눈금 값 설정
        textPosition: 'out', // 축 텍스트를 외부에 배치
        textStyle: {
            fontSize: 12
        }
    },
    chartArea: {
        width: '85%',
        height: '80%',
        left: 50,
        right: 10,
        top: 10,
        bottom: 30
    },
    backgroundColor: 'transparent',
    colors: ['#4285F4'],
    pointSize: 4, // 데이터 포인트 크기
    lineWidth: 1.5, // 선 두께
    connectNulls: true,
    enableInteractivity: true,
    series: {
        0: {
            areaOpacity: 0.1, // 하늘색 영역 채우기 추가
            color: '#4285F4',
            area: { visible: true }
        }
    }
}));

// ✅ 안전한 차트 데이터 가져오기
const safeChartData = (graphId: string) => {
    // 기본 빈 데이터 구조
    const defaultData = [
        ['x', 'Value', { role: 'tooltip', type: 'string', p: { html: true } }],
        [0, null, ''],
        [1, null, ''],
        [2, null, ''],
        [3, null, ''],
        [4, null, '']
    ];

    // 데이터가 없거나 유효하지 않은 경우 기본 데이터 반환
    if (!chartData.value || !chartData.value[graphId] || chartData.value[graphId].length <= 1) {
        return defaultData;
    }

    return chartData.value[graphId];
};

// ✅ 선택된 검사만 필터링
const filteredGraphs = computed(() => {
    return props.selectedTest
        ? testStore.testCategories.filter(test => test.id === props.selectedTest)
        : testStore.testCategories;
});

</script>

<template>
    <div>
        <!-- ✅ hideHeader가 false일 때만 제목과 버튼을 표시 -->
        <div v-if="!hideHeader" class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-bold">총 그래프</h3>
            <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
        </div>

        <div class="overflow-y-scroll max-h-[500px] overflow-x-hidden">
            <div v-for="graph in filteredGraphs" :key="graph.id" class="p-4 mb-2">
                <div class="flex items-center space-x-2 mb-2">
                    <span class="px-2 py-1 rounded text-xs font-bold" :class="[
                        testStore.testCategories.find(test => test.id === graph.id)?.bg || 'bg-gray-200',
                        testStore.testCategories.find(test => test.id === graph.id)?.color || 'text-gray-800'
                    ]">
                        {{ graph.id }}
                    </span>
                    <p class="text-sm font-semibold">{{ graph.name }}</p>
                </div>

                <!-- ✅ 그래프 컨테이너 -->
                <div class="relative h-[180px] w-full">
                    <!-- 차트 영역 - 데이터 있으면 차트, 없으면 "데이터 없음" 메시지 -->
                    <div v-if="hasData(graph.id)" class="absolute inset-0">
                        <GChart :key="graph.id + '-chart'" type="AreaChart" :data="safeChartData(graph.id)"
                            :options="chartOptions" class="w-full h-full" />
                    </div>

                    <!-- 데이터 없음 메시지 -->
                    <div v-else class="absolute inset-0">
                        <div class="h-full w-full flex items-center justify-center">
                            <span class="text-gray-400 text-sm">데이터 없음</span>
                        </div>
                    </div>

                    <!-- 날짜 레이블 -->
                    <div class="absolute bottom-0 w-full">
                        <template v-for="label in getDateLabels(graph.id)" :key="label.text">
                            <span
                                :style="`position: absolute; bottom: 0; left: ${adjustLabelPosition(label.index, getDateLabels(graph.id).length)}%; transform: translateX(-50%);`"
                                class="text-xs text-black pb-1">
                                {{ label.text }}
                            </span>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>