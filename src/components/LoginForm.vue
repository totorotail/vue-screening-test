<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = () => {
    if (!authStore.login(email.value, password.value)) {
        errorMessage.value = authStore.errorMessage;
    } else {
        router.push('/patient-list'); // 로그인 성공 후 환자리스트 페이지로 이동
    }
};
</script>

<template>
    <div class="mt-6">
        <label class="block text-gray-700 font-medium">이메일</label>
        <input v-model="email" type="email" placeholder="Example@example.com" class="w-full p-3 border rounded mt-1" />

        <label class="block mt-4 text-gray-700 font-medium">비밀번호</label>
        <input v-model="password" type="password" placeholder="비밀번호 입력" class="w-full p-3 border rounded mt-1" />

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <button @click="handleLogin"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 mt-6 rounded transition">
            로그인
        </button>

        <button @click="router.push('/signup')"
            class="w-full bg-gray-300 hover:bg-gray-400 text-black p-3 mt-2 rounded transition">
            Sign Up
        </button>
    </div>
</template>
