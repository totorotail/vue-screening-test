<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const hospitalName = ref('');
const location = ref('');
const errorMessage = ref('');

const hospitalLocations = ['서울', '경기도', '충청도', '전라도', '강원도', '경상도'];

const emit = defineEmits(['submit']);

const handleSubmit = () => {
    if (!email.value || !password.value || !confirmPassword.value || !hospitalName.value || !location.value) {
        errorMessage.value = '모든 필드를 입력해주세요.';
        return;
    }
    if (password.value !== confirmPassword.value) {
        errorMessage.value = '비밀번호가 일치하지 않습니다.';
        return;
    }
    emit('submit', { email: email.value, hospitalName: hospitalName.value, location: location.value });
};
</script>

<template>
    <div class="p-8 bg-white shadow-lg rounded-lg w-[600px]">
        <h2 class="text-xl font-bold text-center mb-6">회원가입</h2>

        <label class="block text-gray-700 font-medium">이메일 *</label>
        <input v-model="email" type="email" class="w-full p-3 border rounded mt-1" />

        <label class="block mt-4 text-gray-700 font-medium">비밀번호 *</label>
        <input v-model="password" type="password" class="w-full p-3 border rounded mt-1" />

        <label class="block mt-4 text-gray-700 font-medium">비밀번호 확인 *</label>
        <input v-model="confirmPassword" type="password" class="w-full p-3 border rounded mt-1" />

        <label class="block mt-4 text-gray-700 font-medium">병원명 *</label>
        <input v-model="hospitalName" type="text" class="w-full p-3 border rounded mt-1" />

        <label class="block mt-4 text-gray-700 font-medium">병원위치 *</label>
        <select v-model="location" class="w-full p-3 border rounded mt-1">
            <option value="">선택</option>
            <option v-for="loc in hospitalLocations" :key="loc" :value="loc">
                {{ loc }}
            </option>
        </select>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <button @click="handleSubmit"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 mt-6 rounded transition">
            가입완료
        </button>
    </div>
</template>
