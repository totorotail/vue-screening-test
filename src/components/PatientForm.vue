<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const name = ref('');
const idNumber = ref('');
const phone = ref('');
const patientId = ref('');
const errorMessage = ref('');

const emit = defineEmits(['submit']);

// ✅ 환자번호 중복 확인 함수 (현재 로그인한 유저의 환자 리스트에서 검사)
const checkDuplicatePatientId = () => {
    return authStore.isPatientIdDuplicate(patientId.value);
};

// ✅ 환자 등록 버튼 클릭 시 실행
const handleSubmit = () => {
    if (!name.value || !idNumber.value || !phone.value || !patientId.value) {
        errorMessage.value = '모든 필드를 입력해주세요.';
        return;
    }

    if (checkDuplicatePatientId()) {
        errorMessage.value = '중복된 환자번호가 있습니다.';
        return;
    }

    emit('submit', { name: name.value, idNumber: idNumber.value, phone: phone.value, patientId: patientId.value });
};
</script>

<template>
    <div class="p-8 bg-white shadow-lg rounded-lg w-full max-w-[600px] mx-auto">
        <h2 class="text-xl font-bold text-center mb-6">환자등록</h2>

        <div class="flex flex-col space-y-4">
            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">환자명 *</label>
                <input v-model="name" type="text" class="w-full p-3 border rounded mt-1" placeholder="환자명 입력" />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">주민번호 *</label>
                <input v-model="idNumber" type="text" class="w-full p-3 border rounded mt-1" placeholder="000000-0******" />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">연락처 *</label>
                <input v-model="phone" type="text" class="w-full p-3 border rounded mt-1" placeholder="010-0000-0000" />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">환자번호 *</label>
                <input v-model="patientId" type="text" class="w-full p-3 border rounded mt-1" placeholder="환자번호 입력" />
                <p v-if="checkDuplicatePatientId()" class="text-red-500 text-sm">중복된 환자번호가 있습니다.</p>
            </div>

            <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

            <div class="flex justify-center mt-6">
                <button @click="handleSubmit" class="w-32 py-3 text-white font-semibold rounded-full transition
                    bg-blue-500 hover:bg-blue-600">
                    NEXT
                </button>
            </div>
        </div>
    </div>
</template>
