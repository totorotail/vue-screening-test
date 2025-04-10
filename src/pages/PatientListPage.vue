<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';
import PatientListContent from '../components/PatientListContent.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

// 전체 환자 목록
const patients = computed(() => authStore.user?.patients || []);

// 검색어 상태 (URL 쿼리 기준으로 초기화)
const searchQuery = ref<string>(String(route.query.search || ''));

// 검색 실행 함수
const searchPatients = async () => {
  const query = searchQuery.value.trim();
  currentPage.value = 1;
  await router.replace({ path: '/patient-list', query: query ? { search: query } : {} });
  await nextTick();
};

// 필터링된 환자 목록
const filteredPatients = computed(() => {
  const query = searchQuery.value.trim();
  if (!query) return patients.value;
  return patients.value.filter(patient => patient.name.includes(query));
});

// 페이지네이션 관련 변수
const itemsPerPage = 10;
const currentPage = ref(1);
const totalPages = computed(() => Math.ceil(filteredPatients.value.length / itemsPerPage));
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredPatients.value.slice(start, start + itemsPerPage);
});

// 성별 계산 함수
const getGender = (idNumber: string) => {
  const genderDigit = idNumber.charAt(7);
  return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
};

// 최근 검사일 계산 함수
const getDaysAgo = (examDate: string | null) => {
  if (!examDate) return '없음';
  const examTime = new Date(examDate).getTime();
  const todayTime = new Date().getTime();
  const diffTime = todayTime - examTime;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? `${diffDays}일전` : '오늘';
};

// 환자 상세 페이지로 이동
const goToPatientDetail = (patientNumber: string) => {
  router.push(`/patient-detail/${patientNumber}`);
};

// 환자 등록 페이지로 이동
const goToPatientRegistration = () => {
  router.push('/patient-registration');
};

// 페이지 닫기 → 로그인 페이지로 이동
const closePage = () => {
  router.push('/');
};

// 검색어 URL 반영
watch(() => route.query.search, (newQuery) => {
  searchQuery.value = String(newQuery || '');
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
    <!-- 로고 및 검색창 -->
    <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''"
      v-model:searchQuery="searchQuery" @search="searchPatients" />

    <!-- 상단 헤더 영역 -->
    <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
      <h2 class="text-xl font-semibold text-gray-800">환자리스트</h2>
      <button @click="closePage" class="text-gray-500 hover:text-gray-700">
        <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
      </button>
    </div>

    <!-- 환자 목록 콘텐츠 -->
    <PatientListContent :patients="patients" :filteredPatients="filteredPatients" :paginatedPatients="paginatedPatients"
      :searchQuery="searchQuery" :currentPage="currentPage" :itemsPerPage="itemsPerPage" :getGender="getGender"
      :getDaysAgo="getDaysAgo" @register="goToPatientRegistration" @select="goToPatientDetail" />

    <!-- 페이지네이션 -->
    <div v-if="filteredPatients.length > 0" class="flex justify-center mt-6 space-x-2">
      <button @click="currentPage > 1 && (currentPage--)" :disabled="currentPage === 1"
        class="px-3 py-2 border rounded disabled:opacity-50">
        &lt;
      </button>

      <button v-for="page in totalPages" :key="page" @click="currentPage = page" class="px-4 py-2 border rounded"
        :class="{ 'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-200': page !== currentPage }">
        {{ page }}
      </button>

      <button @click="currentPage < totalPages && (currentPage++)" :disabled="currentPage === totalPages"
        class="px-3 py-2 border rounded disabled:opacity-50">
        &gt;
      </button>
    </div>
  </div>
</template>
