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
        router.push('/signup');
    }
};
</script>

<template>
    <div class="w-96">
        <label class="block mb-1">이메일</label>
        <input v-model="email" type="email" placeholder="Example@example.com" class="w-full p-2 border rounded" />

        <label class="block mt-4 mb-1">비밀번호</label>
        <input v-model="password" type="password" placeholder="비밀번호 입력" class="w-full p-2 border rounded" />

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <button @click="handleLogin" class="w-full bg-blue-500 text-white p-2 mt-4 rounded">로그인</button>

        <button @click="router.push('/signup')" class="w-full bg-gray-200 text-black p-2 mt-2 rounded">Sign Up</button>
    </div>
</template>
