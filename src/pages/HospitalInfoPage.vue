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
        <WideLogo class="w-[90%] max-w-[1400px] mt-4 mb-6" :showSearch="true" :userPlan="userInfo.plan" />

        <div
            class="w-[90%] max-w-[1400px] flex justify-between items-center bg-white px-6 py-4 shadow-md rounded-lg mb-2">
            <h2 class="text-xl font-semibold text-gray-800">병원정보</h2>
            <button @click="closePage" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <div class="w-[90%] max-w-[1400px] flex space-x-4">
            <!-- 병원 정보 -->
            <div class="w-1/3 bg-white shadow-lg rounded-lg p-6">
                <div class="grid grid-cols-[80px_1fr] gap-1">
                    <div class="font-semibold">이메일</div>
                    <div>{{ userInfo.email }}</div>
                    <div class="font-semibold">병원이름</div>
                    <div>{{ userInfo.hospitalName }}</div>
                    <div class="font-semibold">지역</div>
                    <div>{{ userInfo.location }}</div>
                    <div class="font-semibold">플랜</div>
                    <div>{{ userInfo.plan }}</div>
                </div>
                <div class="mt-4">
                    <button @click="openEditModal">
                        <img src="src/assets/setting-icon.png" class="w-6 h-6" alt="설정" />
                    </button>
                </div>
            </div>

            <!-- 플랜 변경 -->
            <div class="w-2/3 bg-white shadow-lg rounded-lg p-6">
                <h2 class="text-lg font-bold mb-4">플랜변경</h2>
                <div class="border-b border-gray-200 mb-4 mt-1"></div>
                <div class="w-[80%] mx-auto">
                    <div class="flex space-x-4">
                        <div v-for="plan in availablePlans" :key="plan.name"
                            class="flex-1 border rounded-lg overflow-hidden">
                            <!-- 상단 컬러 바 -->
                            <div :class="[
                                plan.name === 'STARTER' ? 'bg-gray-100' :
                                    plan.name === 'BASIC' ? 'bg-blue-500' :
                                        'bg-black',
                                'h-2'
                            ]"></div>
                            <!-- 카드 내용 -->
                            <div class="text-center px-3 py-10">
                                <h3 class="mb-2">{{ plan.name }}</h3>
                                <p class="font-bold mb-4">{{ plan.price }}</p>

                                <button v-if="userInfo.plan === plan.name"
                                    class="w-full py-1 border rounded-lg cursor-not-allowed">
                                    {{ plan.name }} 플랜중
                                </button>

                                <button v-else @click="openPlanModal(plan.name)"
                                    class="w-full py-1 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                                    {{ plan.name }} 플랜변경
                                </button>

                                <div class="mt-4 text-left">
                                    <p v-for="benefit in plan.benefits" :key="benefit" class="text-sm flex items-start">
                                        <span class="text-green-600 mr-1 mb-1">✓</span>
                                        {{ benefit.replace('✔️ ', '') }}
                                    </p>
                                </div>
                            </div>
                        </div>
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
