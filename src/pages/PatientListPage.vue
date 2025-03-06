<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';

const router = useRouter();
const authStore = useAuthStore();

const patients = computed(() => authStore.user?.patients || []);

// ✅ 주민등록번호로 성별 판별 (1,3 → 남자 / 2,4 → 여자)
const getGender = (idNumber: string) => {
  const genderDigit = idNumber.charAt(7);
  return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
};

// ✅ 환자 등록 페이지로 이동
const goToPatientRegistration = () => {
  router.push('/patient-registration');
};

const closePage = () => {
  router.push('/'); // 로그인 페이지로 이동
};
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-gray-50 w-full">
    <!-- ✅ WideLogo에서 현재 로그인한 사용자의 플랜을 전달 -->
    <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="authStore.user?.plan || ''" />

    <div class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-4">
        <h2 class="text-xl font-semibold text-gray-800">환자리스트</h2>
        <button @click="closePage" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
    </div>

    <!-- ✅ 환자가 없는 경우 -->
    <div v-if="patients.length === 0" class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
      <p class="text-gray-600 text-lg font-semibold">등록된 환자가 없습니다.<br>환자를 등록해주세요.</p>
      <img src="../assets/no-patient.png" alt="No Patients" class="w-64 mt-4" />
      <button @click="goToPatientRegistration"
        class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
        환자등록
      </button>
    </div>

    <!-- ✅ 환자가 있는 경우 -->
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
          <tr v-for="patient in patients" :key="patient.id" class="border-b border-gray-200">
            <td class="p-3">{{ patient.id }}</td>
            <td class="p-3">{{ patient.name }}</td>
            <td class="p-3">{{ patient.patientNumber }}</td>
            <td class="p-3">{{ patient.birthDate }}</td>
            <td class="p-3">{{ getGender(patient.idNumber) }}</td>
            <td class="p-3">{{ patient.phone }}</td>
            <td class="p-3">{{ patient.lastExam || 'null' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
