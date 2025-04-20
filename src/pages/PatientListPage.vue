<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import WideLogo from '../components/WideLogo.vue';
import PatientListContent from '../components/PatientListContent.vue';
import PatientService from '../services/PatientService';
import HospitalService from '../services/HospitalService';

// 라우터 설정
const route = useRoute();
const router = useRouter();

// 병원 정보 상태
const hospitalInfo = ref<{ plan: string } | null>(null);

// 환자 목록 상태
const allPatients = ref<any[]>([]);

// 검색어 상태 (쿼리에서 초기화)
const searchQuery = ref<string>(String(route.query.search || ''));

// 현재 페이지 및 페이지당 항목 수
const currentPage = ref(1);
const itemsPerPage = 10;

// 병원 정보 불러오기
const fetchHospitalInfo = async () => {
  try {
    const response = await HospitalService.getMyInfo();
    hospitalInfo.value = response.data;
  } catch (error) {
    console.error('병원 정보 불러오기 실패:', error);
    router.push('/');
  }
};

// 환자 정보 가져오기
const fetchPatients = async () => {
  const query = searchQuery.value.trim();
  try {
    if (query) {
      const res = await PatientService.searchPatientsByName(query, 0, 1000);
      allPatients.value = res.data.content;
    } else {
      const res = await PatientService.getAllPatients(0, 1000);
      allPatients.value = res.data.content;
    }
  } catch (err) {
    console.error('환자 목록 실패:', err);
  }
};

// 검색 실행
const searchPatients = async () => {
  const query = searchQuery.value.trim();
  currentPage.value = 1;
  await router.replace({ path: '/patient-list', query: query ? { search: query } : {} });
  await fetchPatients();
  await nextTick();
};

// 초기 실행
onMounted(async () => {
  await fetchHospitalInfo();
  await fetchPatients();
});

// 페이지 계산
const totalPages = computed(() => Math.ceil(allPatients.value.length / itemsPerPage));
const paginatedPatients = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return allPatients.value.slice(start, start + itemsPerPage);
});

// 성별 계산 함수
const getGender = (idNumber: string) => {
  const genderDigit = idNumber.charAt(7);
  return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
};

// 최근 검사일 계산 함수
const getDaysAgo = (date: string | null) => {
  if (!date) return '없음';
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return days > 0 ? `${days}일전` : '오늘';
};

// 환자 상세 이동
const goToPatientDetail = (id: number) => router.push(`/patient-detail/${id}`);
const goToPatientRegistration = () => router.push('/patient-registration');
const closePage = () => router.push('/');

// URL 쿼리 변화 감지
watch(() => route.query.search, async (newVal) => {
  searchQuery.value = String(newVal || '');
  await fetchPatients();
});
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full" v-if="hospitalInfo">
    <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="hospitalInfo.plan"
      v-model:searchQuery="searchQuery" @search="searchPatients" />

    <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
      <h2 class="text-xl font-semibold text-gray-800">환자리스트</h2>
      <button @click="closePage" class="text-gray-500 hover:text-gray-700">
        <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
      </button>
    </div>

    <PatientListContent :patients="allPatients" :filteredPatients="allPatients" :paginatedPatients="paginatedPatients"
      :searchQuery="searchQuery" :currentPage="currentPage" :itemsPerPage="itemsPerPage" :getGender="getGender"
      :getDaysAgo="getDaysAgo" @register="goToPatientRegistration" @select="goToPatientDetail" />

    <!-- 페이지네이션 -->
    <div v-if="allPatients.length > 0" class="flex justify-center mt-6 space-x-2">
      <button @click="currentPage > 1 && (currentPage--)" :disabled="currentPage === 1"
        class="px-3 py-2 border rounded disabled:opacity-50">&lt;</button>
      <button v-for="page in totalPages" :key="page" @click="currentPage = page" class="px-4 py-2 border rounded"
        :class="{ 'bg-blue-500 text-white': page === currentPage, 'hover:bg-gray-200': page !== currentPage }">
        {{ page }}
      </button>
      <button @click="currentPage < totalPages && (currentPage++)" :disabled="currentPage === totalPages"
        class="px-3 py-2 border rounded disabled:opacity-50">&gt;</button>
    </div>
  </div>
</template>
