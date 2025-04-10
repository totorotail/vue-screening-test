<script setup lang="ts">
defineProps<{
    patient: any,
    maskedIdNumber: string
}>();
const emit = defineEmits(['start']);
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-39 shadow-md rounded-lg text-center mt-1">
        <h2 class="text-2xl font-bold mb-4">선별검사를 시작하겠습니다.</h2>
        <p class="text-gray-600 mb-8">아래의 정보가 맞다면 시작을 눌러주세요.</p>

        <div class="bg-gray-100 p-6 rounded-lg inline-block text-left text-gray-700 space-y-3">
            <p><strong>환자명:</strong> {{ patient?.name || '정보 없음' }}</p>
            <p><strong>주민번호:</strong> {{ maskedIdNumber }}</p>
            <p><strong>연락처:</strong> {{ patient?.phone || '정보 없음' }}</p>
        </div>

        <div class="mt-6">
            <button @click="emit('start')"
                class="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition">
                검사시작
            </button>
        </div>
    </div>
</template>
