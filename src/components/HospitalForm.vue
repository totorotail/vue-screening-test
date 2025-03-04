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
    <div class="p-6 bg-white shadow-lg rounded-lg">
        <h2 class="text-xl font-bold">가입내용</h2>

        <label class="block mt-4">이메일 *</label>
        <input v-model="email" type="email" class="w-full p-2 border rounded" />

        <label class="block mt-4">비밀번호 *</label>
        <input v-model="password" type="password" class="w-full p-2 border rounded" />

        <label class="block mt-4">비밀번호 확인 *</label>
        <input v-model="confirmPassword" type="password" class="w-full p-2 border rounded" />

        <label class="block mt-4">병원명 *</label>
        <input v-model="hospitalName" type="text" class="w-full p-2 border rounded" />

        <label class="block mt-4">병원위치 *</label>
        <select v-model="location" class="w-full p-2 border rounded">
            <option value="">선택</option>
            <option v-for="loc in hospitalLocations" :key="loc" :value="loc">
                {{ loc }}
            </option>
        </select>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>

        <button @click="handleSubmit" class="w-full bg-blue-500 text-white p-2 mt-4 rounded">
            가입완료
        </button>
    </div>
</template>
