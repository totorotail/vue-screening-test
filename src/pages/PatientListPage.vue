<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 환자 목록 가져오기
const patients = computed(() => authStore.user?.patients || []);

// 검색어 상태 변수 (라우트에서 가져오기)
const searchQuery = ref<string>(String(route.query.search || ''));

// 검색 실행 함수 (돋보기 버튼 클릭 시 실행됨)
const searchPatients = async () => {
  const query = searchQuery.value.trim();
  currentPage.value = 1; // 검색 후 첫 페이지로 이동
  await router.replace({ path: '/patient-list', query: query ? { search: query } : {} });
  await nextTick(); // Vue 업데이트 반영을 강제 실행
};

// 검색어를 기준으로 필터링된 환자 리스트
const filteredPatients = computed(() => {
  const query = searchQuery.value.trim();
  if (!query) return patients.value;
  return patients.value.filter(patient => patient.name.includes(query));
});

// 한 페이지에 표시할 환자 수
const itemsPerPage = 10;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredPatients.value.length / itemsPerPage));

// 현재 페이지에 해당하는 환자 리스트
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPatients.value.slice(start, start + itemsPerPage);
});

// 주민등록번호로 성별 판별 (1,3 → 남자 / 2,4 → 여자)
const getGender = (idNumber: string) => {
  const genderDigit = idNumber.charAt(7);
  return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
};

// 최근 검사일을 "XX일 전"으로 변환하는 함수
const getDaysAgo = (examDate: string | null) => {
  if (!examDate) return "없음";
  const examTime = new Date(examDate).getTime();
  const todayTime = new Date().getTime();
  const diffTime = todayTime - examTime;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // 밀리초 → 일 단위 변환
  return diffDays > 0 ? `${diffDays}일전` : "오늘";
};

// 환자 상세보기로 이동하는 함수
const goToPatientDetail = (patientNumber: string) => {
  router.push(`/patient-detail/${patientNumber}`);
};

// 페이지네이션 이동 (버튼 클릭 시 실행됨)
const goToPage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

// 환자 등록 페이지로 이동
const goToPatientRegistration = () => {
  router.push('/patient-registration');
};

// 로그인 페이지로 이동
const closePage = () => {
  router.push('/');
};

// `watch`를 사용하여 URL의 query.search 값이 변경되면 searchQuery 업데이트
watch(() => route.query.search, (newQuery) => {
  searchQuery.value = String(newQuery || '');
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
    <!-- WideLogo에서 현재 로그인한 사용자의 플랜을 전달 -->
    <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''"
      v-model:searchQuery="searchQuery" @search="searchPatients" />

    <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
      <h2 class="text-xl font-semibold text-gray-800">환자리스트</h2>
      <button @click="closePage" class="text-gray-500 hover:text-gray-700">
        <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
      </button>
    </div>

    <!-- 검색 전 환자가 없는 경우 -->
    <div v-if="patients.length === 0 && !searchQuery"
      class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
      <p class="text-gray-600 text-lg font-semibold">등록된 환자가 없습니다.<br>환자를 등록해주세요.</p>
      <img src="../assets/no-patient.png" alt="No Patients" class="w-64 mt-4" />
      <button @click="goToPatientRegistration"
        class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
        환자등록
      </button>
    </div>

    <!-- 검색 후 검색 결과가 없는 경우 -->
    <div v-else-if="filteredPatients.length === 0 && searchQuery"
      class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
      <p class="text-gray-600 text-lg font-semibold">
        '{{ searchQuery }}'이 없습니다.
      </p>
      <button @click="goToPatientRegistration"
        class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
        환자등록
      </button>
    </div>

    <!-- 환자가 있는 경우 -->
    <div v-else class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-300 text-left text-gray-700">
            <th class="p-3">NO</th>
            <th class="p-3">환자명</th>
            <th class="p-3">환자번호</th>
            <th class="p-3">생년월일</th>
            <th class="p-3">성별</th>
            <th class="p-3">번호</th>
            <th class="p-3">최근검사</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(patient, index) in paginatedPatients" :key="patient.patientNumber"
            class="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
            @click="goToPatientDetail(patient.patientNumber)">
            <td class="p-3">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
            <td class="p-3">{{ patient.name }}</td>
            <td class="p-3">{{ patient.patientNumber }}</td>
            <td class="p-3">{{ patient.birthDate }}</td>
            <td class="p-3">{{ getGender(patient.idNumber) }}</td>
            <td class="p-3">{{ patient.phone }}</td>
            <td class="p-3">{{ getDaysAgo(patient.lastExam) }}</td> <!-- 최신 검사 날짜 변환 적용 -->
          </tr>
        </tbody>
      </table>

      <!-- 페이지네이션 -->
      <div class="flex justify-center mt-6 space-x-2">
        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-2 border rounded disabled:opacity-50">
          &lt;
        </button>

        <button v-for="page in totalPages" :key="page" @click="goToPage(page)" class="px-4 py-2 border rounded"
          :class="{ 'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-200': page !== currentPage }">
          {{ page }}
        </button>

        <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-2 border rounded disabled:opacity-50">
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>
