<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';
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
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="userInfo.plan"
            userImage="../assets/profile-user.png" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">병원정보</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>

        <div class="w-[90%] max-w-[1400px] flex mt-6 space-x-6">
            <!-- 병원 정보 -->
            <div class="w-1/3 bg-white shadow-lg rounded-lg p-6">
                <p class="text-gray-600"><strong>이메일:</strong> {{ userInfo.email }}</p>
                <p class="text-gray-600"><strong>병원이름:</strong> {{ userInfo.hospitalName }}</p>
                <p class="text-gray-600"><strong>지역:</strong> {{ userInfo.location }}</p>
                <p class="text-gray-600"><strong>플랜:</strong> {{ userInfo.plan }}</p>
                <div class="mt-4 flex">
                    <button @click="openEditModal" class="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition">
                        ⚙️ 설정
                    </button>
                </div>
            </div>

            <!-- 플랜 변경 -->
            <div class="w-2/3 bg-white shadow-lg rounded-lg p-6">
                <h2 class="text-lg font-bold mb-4">플랜변경</h2>
                <div class="flex space-x-4">
                    <div v-for="plan in availablePlans" :key="plan.name"
                        class="flex-1 p-4 border rounded-lg shadow-lg text-center"
                        :class="{ 'border-blue-500': userInfo.plan === plan.name }">
                        <h3 class="text-lg font-bold">{{ plan.name }}</h3>
                        <p class="text-gray-600">{{ plan.price }}</p>

                        <button v-if="userInfo.plan === plan.name"
                            class="mt-2 w-full py-2 border rounded-lg bg-gray-200 opacity-50 cursor-not-allowed">
                            {{ plan.name }} 플랜중
                        </button>

                        <button v-else @click="openPlanModal(plan.name)"
                            class="mt-2 w-full py-2 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                            {{ plan.name }} 플랜변경
                        </button>

                        <ul class="mt-2 text-sm text-gray-700 text-left">
                            <li v-for="benefit in plan.benefits" :key="benefit">{{ benefit }}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <PlanChangeModal :show="showPlanModal" :selectedPlan="selectedPlan" @confirm="changePlan"
            @close="showPlanModal = false" />
        <EditHospitalInfoModal :show="showEditModal" :hospitalName="userInfo.hospitalName" :location="userInfo.location"
            @update="updateHospitalInfo" @close="showEditModal = false" />
    </div>
</template>
