<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    show: Boolean,
    hospitalName: String,
    location: String,
});

const emit = defineEmits(["close", "update"]);

const password = ref("");
const confirmPassword = ref("");
const newHospitalName = ref(props.hospitalName);
const newLocation = ref(props.location);
const isPasswordValid = ref(false);

// 저장 버튼 클릭 시 실행
const saveHospitalInfo = () => {
    if (password.value === confirmPassword.value) {
        isPasswordValid.value = true;
        emit("update", { hospitalName: newHospitalName.value, location: newLocation.value });
    } else {
        isPasswordValid.value = false;
    }
};
</script>

<template>
    <div v-if="show" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[500px]">
        <h2 class="text-lg font-bold mb-4">병원정보 수정</h2>
        <div class="space-y-3">
            <input v-model="password" type="password" placeholder="비밀번호 *" class="w-full px-4 py-2 border rounded-lg">
            <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인 *" class="w-full px-4 py-2 border rounded-lg">
            <input v-model="newHospitalName" type="text" placeholder="병원이름" class="w-full px-4 py-2 border rounded-lg">
            <input v-model="newLocation" type="text" placeholder="병원위치" class="w-full px-4 py-2 border rounded-lg">
        </div>
        <div class="flex justify-between mt-4">
            <button @click="emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-200 transition">취소</button>
            <button @click="saveHospitalInfo" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition" :disabled="password !== confirmPassword">
                CONFIRM
            </button>
        </div>
    </div>
</template>
