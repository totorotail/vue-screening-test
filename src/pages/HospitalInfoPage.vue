<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import HospitalService from '../services/HospitalService';
import WideLogo from '../components/WideLogo.vue';
import HospitalProfile from '../components/HospitalProfile.vue';
import PlanSelector from '../components/PlanSelector.vue';
import PlanChangeModal from '../components/PlanChangeModal.vue';
import EditHospitalInfoModal from '../components/EditHospitalInfoModal.vue';

const router = useRouter();

// 병원 정보 타입 정의
type HospitalInfoResponse = {
    email: string;
    hospitalName: string;
    location: string;
    plan: string;
};

// 병원 정보 상태 변수
const hospitalInfo = ref<HospitalInfoResponse | null>(null);

// 병원 요금제 옵션
const availablePlans = [
    { name: 'STARTER', price: '0원 / 월', benefits: ['✔️ 베네핏내용1'] },
    { name: 'BASIC', price: '12,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2'] },
    { name: 'PREMIUM', price: '20,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2', '✔️ 베네핏내용3'] }
];

// 모달 상태 변수
const showPlanModal = ref(false);
const selectedPlan = ref('');
const showEditModal = ref(false);

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

onMounted(() => {
    fetchHospitalInfo();
});

// 플랜 변경 확인 모달 띄우기
const openPlanModal = (plan: string) => {
    selectedPlan.value = plan;
    if (plan === 'STARTER') {
        showPlanModal.value = true;
    } else {
        changePlan(); // STARTER가 아닌 경우 즉시 변경
    }
};

// 플랜 변경 실행
const changePlan = async () => {
    if (!selectedPlan.value) return;
    try {
        await HospitalService.updatePlan({ plan: selectedPlan.value });
        await fetchHospitalInfo();
        showPlanModal.value = false;
    } catch (error) {
        console.error('플랜 변경 실패:', error);
    }
};

// 병원 정보 수정 모달 열기
const openEditModal = () => {
    showEditModal.value = true;
};

// 병원 정보 업데이트 (비밀번호 포함 가능)
const updateHospitalInfo = async (data: { hospitalName: string; location: string; password?: string }) => {
    try {
        await HospitalService.updateInfo({
            password: data.password || '',
            hospitalName: data.hospitalName,
            location: data.location
        });
        await fetchHospitalInfo();
        showEditModal.value = false;
    } catch (error) {
        console.error('병원 정보 업데이트 실패:', error);
    }
};

// 페이지 닫기
const closePage = () => {
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center relative" v-if="hospitalInfo">
        <!-- 상단 로고 -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="hospitalInfo.plan" />

        <!-- 헤더 타이틀 -->
        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-3 shadow-md rounded-lg mb-2">
            <h2 class="text-xl font-semibold text-gray-800">병원정보</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 병원 정보 & 플랜 변경 -->
        <div class="w-[90%] max-w-[1400px] flex space-x-4">
            <!-- 병원 프로필 카드 -->
            <HospitalProfile :email="hospitalInfo.email" :hospitalName="hospitalInfo.hospitalName"
                :location="hospitalInfo.location" :plan="hospitalInfo.plan" @open-edit="openEditModal" />

            <!-- 플랜 선택 카드 -->
            <PlanSelector :currentPlan="hospitalInfo.plan" :availablePlans="availablePlans" @select="openPlanModal" />
        </div>

        <!-- 플랜 변경 확인 모달 -->
        <PlanChangeModal :show="showPlanModal" :selectedPlan="selectedPlan" @confirm="changePlan"
            @close="showPlanModal = false" />

        <!-- 병원 정보 수정 모달 -->
        <EditHospitalInfoModal :show="showEditModal" :hospitalName="hospitalInfo.hospitalName"
            :location="hospitalInfo.location" @update="updateHospitalInfo" @close="showEditModal = false" />
    </div>
</template>
