<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';
import HospitalProfile from '../components/HospitalProfile.vue';
import PlanSelector from '../components/PlanSelector.vue';
import PlanChangeModal from '../components/PlanChangeModal.vue';
import EditHospitalInfoModal from '../components/EditHospitalInfoModal.vue';

const router = useRouter();
const authStore = useAuthStore();
const userInfo = computed(() => authStore.user || { email: '', hospitalName: '', location: '', plan: '' });

const availablePlans = [
    { name: 'STARTER', price: '0원 / 월', benefits: ['✔️ 베네핏내용1'] },
    { name: 'BASIC', price: '12,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2'] },
    { name: 'PREMIUM', price: '20,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2', '✔️ 베네핏내용3'] }
];

// 상태 변수
const showPlanModal = ref(false);
const selectedPlan = ref('');
const showEditModal = ref(false);

// 플랜 변경 확인 모달 띄우기
const openPlanModal = (plan: string) => {
    selectedPlan.value = plan; // 선택한 플랜 저장
    if (plan === 'STARTER') {
        showPlanModal.value = true;
    } else {
        changePlan(); // STARTER가 아니면 즉시 변경 실행
    }
};

// 플랜 변경 실행
const changePlan = () => {
    authStore.user!.plan = selectedPlan.value;
    showPlanModal.value = false;
};

// 병원 정보 수정 모달 열기
const openEditModal = () => {
    showEditModal.value = true;
};

// 병원 정보 업데이트
const updateHospitalInfo = (data: { hospitalName: string, location: string }) => {
    authStore.user!.hospitalName = data.hospitalName;
    authStore.user!.location = data.location;
    showEditModal.value = false;
};

// 페이지 닫기
const closePage = () => {
    router.push('/'); // 로그인 페이지로 이동
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center relative">
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="userInfo.plan" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-xl font-semibold text-gray-800">병원정보</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <div class="w-[90%] max-w-[1400px] flex space-x-4">
            <!-- 병원 정보 -->
            <HospitalProfile :email="userInfo.email" :hospitalName="userInfo.hospitalName" :location="userInfo.location"
                :plan="userInfo.plan" @open-edit="openEditModal" />

            <!-- 플랜 변경 -->
            <PlanSelector :currentPlan="userInfo.plan" :availablePlans="availablePlans" @select="openPlanModal" />
        </div>

        <PlanChangeModal :show="showPlanModal" :selectedPlan="selectedPlan" @confirm="changePlan"
            @close="showPlanModal = false" />
        <EditHospitalInfoModal :show="showEditModal" :hospitalName="userInfo.hospitalName" :location="userInfo.location"
            @update="updateHospitalInfo" @close="showEditModal = false" />
    </div>
</template>
