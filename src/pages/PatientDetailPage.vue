<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useTestStore } from '../stores/testStore';
import WideLogo from '../components/WideLogo.vue';
import EditPatientInfoModal from '../components/EditPatientInfoModal.vue';
import SelectTestModal from '../components/SelectTestModal.vue';
import Chart from 'vue-google-charts';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const testStore = useTestStore();

// ✅ 환자 정보 가져오기
const patient = ref<any>(null);

// ✅ 환자 데이터 가져오는 함수
const fetchPatient = () => {
    const patientId = String(route.params.id || '');
    if (authStore.user?.patients) {
        const foundPatient = authStore.user.patients.find(p => String(p.patientNumber) === patientId);
        console.log("🔍 찾은 환자 정보:", foundPatient);
        patient.value = foundPatient || null;
    }
};

// ✅ `authStore.user`가 로드된 후 실행되도록 `watch` 사용
watch(() => authStore.user, (newUser) => {
    if (newUser) fetchPatient();
}, { immediate: true });

// ✅ 주민등록번호로 성별 판별
const gender = computed(() => {
    if (!patient.value || !patient.value.idNumber) return '없음';
    const genderDigit = patient.value.idNumber.charAt(7);
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
});

// ✅ 모달창 상태
const showModal = ref(false);
const showTestModal = ref(false);
const selectedTests = ref<string[]>([]);

// ✅ 검사 선택 후 처리
const handleTestSelection = (tests: string[]) => {
    selectedTests.value = tests;
    showTestModal.value = false;
    if (tests.length > 0) {
        router.push({ name: 'TestPage', query: { patientId: patient.value.patientNumber, tests: tests.join(',') } });
    }
};

// ✅ 환자 정보 업데이트 함수
const updatePatientInfo = (updatedPatient: any) => {
    if (!authStore.user) return;
    const index = authStore.user.patients.findIndex(p => p.patientNumber === patient.value.patientNumber);
    if (index !== -1) {
        authStore.user.patients[index] = updatedPatient;
        patient.value = updatedPatient; // 화면 갱신
    }
};

// ✅ Google Charts 옵션
const chartOptions = {
    title: '',
    curveType: 'function',
    legend: 'none',
    vAxis: { minValue: 0, maxValue: 80 },
    chartArea: { width: '85%', height: '70%' },
    backgroundColor: '#ffffff'
};

// ✅ ExamResult 타입 직접 정의
interface ExamResult {
    totalScore: number;
    responses: number[];
}

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

// ✅ 페이지 이동 함수
const goToPage = (page: number) => {
    if (page > 0 && page <= totalPages.value) {
        currentPage.value = page;
    }
};

// ✅ 날짜별 검사 기록을 정리하여 검사 기록 목록에 표시할 데이터 생성
const formattedExamRecords = computed(() => {
    if (!patient.value || !patient.value.examRecords) return [];

    return Object.entries(patient.value.examRecords).map(([date, exams]) => {
        const examEntries = exams as Record<string, ExamResult>; // ✅ 명확한 타입 지정
        const examTypes = Object.keys(examEntries);
        const displayedExams = examTypes.slice(0, 4); // 최대 4개까지 표시
        const moreExams = examTypes.length > 4 ? `+${examTypes.length - 4}` : '';

        return {
            date,
            displayedExams,
            moreExams
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // 최신 날짜순 정렬
});
</script>

<template>
    <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg flex justify-between">
            <h2 class="text-xl font-semibold text-gray-800">환자 상세보기</h2>
            <img src="../assets/close-icon.png" alt="닫기" class="w-6 h-6 cursor-pointer">
        </div>

        <div class="w-[90%] max-w-[1400px] flex mt-4">
            <!-- ✅ 왼쪽: 환자 정보 -->
            <div class="w-2/5 bg-white p-6 shadow-lg rounded-lg">
                <div class="flex justify-between items-center">
                    <p class="font-bold text-lg">{{ patient?.name || '없음' }}</p>
                    <img src="../assets/setting-icon.png" alt="설정" class="w-6 h-6 cursor-pointer"
                        @click="showModal = true">
                </div>

                <!-- ✅ 환자 정보 정리 (가로 정렬) -->
                <div class="mt-4">
                    <div class="flex space-x-4 text-gray-600 mt-1">
                        <span>{{ patient?.birthDate?.replace(/-/g, '.') || '없음' }}</span>
                        <span>|</span>
                        <span>{{ gender }}</span>
                        <span>|</span>
                        <span>{{ patient?.phone || '없음' }}</span>
                        <span>|</span>
                        <span>{{ patient?.patientNumber || '없음' }}</span>
                    </div>
                </div>

                <hr class="my-4 border-gray-300">

                <!-- ✅ 총 그래프 -->
                <div class="mt-6 flex justify-between items-center">
                    <h3 class="text-lg font-bold">총 그래프</h3>
                    <button class="px-3 py-1 bg-gray-300 text-sm font-semibold rounded-md">PRINT</button>
                </div>

                <div class="overflow-y-scroll max-h-[500px]">
                    <div v-for="graph in testStore.testCategories" :key="graph.id" class="border p-4 mb-2 rounded-lg">
                        <div class="flex items-center space-x-2">
                            <span :class="[graph.bg, 'px-2 py-1 rounded text-xs font-bold text-white']">{{ graph.id
                                }}</span>
                            <p class="text-sm font-semibold">{{ graph.name }}</p>
                        </div>
                        <div class="h-32 w-full">
                            <Chart type="LineChart" :data="[
                                ['날짜', '점수'],
                                ['23.01.08', 0],
                                ['23.02.12', 0],
                                ['23.04.24', 0],
                                ['23.06.02', 0]
                            ]" :options="chartOptions" class="w-full h-full" />
                        </div>
                        <p class="text-sm text-gray-500 text-right mt-1">날짜: 23.06.02</p>
                    </div>
                </div>
            </div>

            <!-- ✅ 중앙: 검사 기록 -->
            <div class="w-1/5 ml-4 bg-white p-6 shadow-lg rounded-lg flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-center">
                        <h3 class="text-lg font-bold">검사기록</h3>
                        <button @click="showTestModal = true"
                            class="px-1 py-1 border border-black text-black text-sm font-semibold rounded-lg hover:bg-gray-100 transition">
                            검사하기
                        </button>

                    </div>
                    <hr class="my-2">

                    <!-- ✅ 검사 기록이 없을 경우 -->
                    <p v-if="paginatedExamRecords.length === 0" class="text-gray-500">검사기록이 없습니다.</p>

                    <!-- ✅ 검사 기록이 있을 경우 -->
                    <ul v-else>
                        <li v-for="record in paginatedExamRecords" :key="record.date" class="py-3 border-b">
                            <!-- ✅ 첫 번째 줄: 체크박스 + 날짜 + '검사' -->
                            <div class="flex items-center space-x-2">
                                <input type="checkbox" v-model="selectedRecords" :value="record.date"
                                    class="cursor-pointer">
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

                <!-- ✅ 페이지네이션 (하단으로 이동) -->
                <div class="flex justify-center mt-4 space-x-1">
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





            <!-- ✅ 오른쪽: 빈 공간 유지 -->
            <div class="w-2/5"></div>
        </div>
    </div>

    <!-- ✅ 환자정보 수정 모달 -->
    <EditPatientInfoModal v-if="showModal" :patient="patient" @close="showModal = false"
        @updatePatient="updatePatientInfo" />

    <SelectTestModal v-if="showTestModal" @close="showTestModal = false" @confirm="handleTestSelection" />
</template>
