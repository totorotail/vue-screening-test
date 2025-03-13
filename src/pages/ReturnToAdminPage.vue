<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// ✅ 비밀번호 입력 값
const password = ref('');

// ✅ NEXT 버튼 활성화 여부 (비밀번호가 입력되었는지 확인)
const isNextEnabled = computed(() => password.value.length > 0);

// ✅ 비밀번호 검증 후 페이지 이동
const goToAdminMode = () => {
    if (password.value === 'Admin123!') { // 실제 구현에서는 서버 요청 필요
        router.push('/patient-detail'); // 환자 상세보기 페이지로 이동
    } else {
        alert('비밀번호가 올바르지 않습니다.');
    }
};
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="w-[400px] bg-white p-8 shadow-md rounded-lg text-center">
            <h2 class="text-xl font-bold mb-6">병원관리자 모드로 돌아갑니다.</h2>

            <!-- ✅ 비밀번호 입력 -->
            <div class="text-left mb-4">
                <label for="password" class="block text-sm font-medium text-gray-700">비밀번호</label>
                <input type="password" id="password" v-model="password"
                    class="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="********" />
            </div>

            <!-- ✅ NEXT 버튼 -->
            <button @click="goToAdminMode" :disabled="!isNextEnabled"
                class="w-full py-2 mt-2 rounded-lg font-semibold transition-colors" :class="isNextEnabled
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-blue-200 text-gray-400 cursor-not-allowed'">
                NEXT
            </button>
        </div>
    </div>
</template>
