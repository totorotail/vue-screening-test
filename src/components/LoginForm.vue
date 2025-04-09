<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const showEmailError = ref(false);
const showPasswordError = ref(false);

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// 이메일과 비밀번호가 유효한지 확인
const isFormValid = computed(() => {
    return validateEmail(email.value) && password.value.length > 0;
});

const handleNext = () => {
    // 이메일 유효성 검사
    showEmailError.value = !validateEmail(email.value);
    
    // 비밀번호 검증
    if (password.value.length === 0) {
        showPasswordError.value = true;
        return;
    }
    
    if (isFormValid.value) {
        // 기존 로그인 로직 유지
        if (!authStore.login(email.value, password.value)) {
            showPasswordError.value = true;
        } else {
            router.push('/patient-list'); // 로그인 성공 후 환자리스트 페이지로 이동
        }
    }
};
</script>

<template>
    <div>
        <div class="mb-6">
            <label class="block text-gray-700 text-sm">이메일</label>
            <input v-model="email" type="email" placeholder="Example@example.com" 
                   class="w-full p-3 border rounded border-gray-300 bg-gray-50 mt-1" />
            <p v-if="showEmailError" class="text-orange-500 text-xs mt-1">이메일을 정확히 입력해주세요.</p>
        </div>

        <div class="mb-2">
            <label class="block text-gray-700 text-sm">비밀번호</label>
            <input v-model="password" type="password" placeholder="영문 소문자, 대문자, 숫자 8자리 이상" 
                   class="w-full p-3 border rounded border-gray-300 bg-gray-50 mt-1" />
            <p v-if="showPasswordError" class="text-orange-500 text-xs mt-1">비밀번호가 맞지 않습니다.</p>
        </div>

        <div class="flex justify-end mb-10">
            <a href="#" class="text-xs text-gray-500 hover:text-gray-700 underline">비밀번호찾기</a>
        </div>

        <div class="flex justify-center space-x-4">
            <button @click="router.push('/signup')"
                class="w-[45%] bg-white hover:bg-gray-100 text-black py-3 rounded-full font-bold border border-gray-300">
                SIGN UP
            </button>
            <button @click="handleNext"
                :disabled="!isFormValid"
                :class="[
                    'w-[45%] py-3 rounded-full font-bold',
                    isFormValid 
                        ? 'bg-blue-100 hover:bg-blue-200 text-blue-600 cursor-pointer' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                ]">
                NEXT
            </button>
        </div>
    </div>
</template>