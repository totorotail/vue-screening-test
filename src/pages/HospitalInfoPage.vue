<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import WideLogo from '../components/WideLogo.vue';

const router = useRouter();
const authStore = useAuthStore();
const userInfo = computed(() => authStore.user || { email: '', hospitalName: '', location: '', plan: '' });

const availablePlans = [
    { name: 'STARTER', price: '0원 / 월', benefits: ['✔️ 베네핏내용1'] },
    { name: 'BASIC', price: '12,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2'] },
    { name: 'PREMIUM', price: '20,000원 / 월', benefits: ['✔️ 베네핏내용1', '✔️ 베네핏내용2', '✔️ 베네핏내용3'] }
];

// 플랜 변경 로직
const changePlan = (newPlan: string) => {
    if (userInfo.value.plan !== newPlan) {
        authStore.user!.plan = newPlan;
    }
};

const closePage = () => {
    router.push('/'); // 로그인 페이지로 이동
};
</script>

<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center">
        <!-- ✅ 로고 부분 (병원가입 페이지와 동일한 너비 유지) -->
        <WideLogo class="w-[90%] max-w-[1400px] mt-6 mb-6" :showSearch="true" :userPlan="userInfo.plan"
            userImage="../assets/profile-user.png" />

        <!-- ✅ 타이틀 부분 (병원정보) -->
        <div class="w-[90%] max-w-[1400px] bg-white px-6 py-4 shadow-md rounded-lg mb-4">
            <h2 class="text-xl font-semibold text-gray-800">병원정보</h2>
        </div>

        <!-- ✅ 메인 부분 -->
        <div class="w-[90%] max-w-[1400px] flex mt-6 space-x-6">
            <!-- 병원 정보 -->
            <div class="w-1/3 bg-white shadow-lg rounded-lg p-6">
                <h2 class="text-lg font-bold mb-4">병원정보</h2>
                <p class="text-gray-600"><strong>이메일:</strong> {{ userInfo.email }}</p>
                <p class="text-gray-600"><strong>병원이름:</strong> {{ userInfo.hospitalName }}</p>
                <p class="text-gray-600"><strong>지역:</strong> {{ userInfo.location }}</p>
                <p class="text-gray-600"><strong>플랜:</strong> {{ userInfo.plan }}</p>
                <div class="mt-4 flex justify-center">
                    <button class="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition">
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

                        <button v-else @click="changePlan(plan.name)"
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
    </div>
</template>
