<script setup lang="ts">
defineProps<{
    patientName: string
}>();
const emit = defineEmits(['confirm']);
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-55 shadow-md rounded-lg text-center mt-1">
        <h2 class="text-2xl font-bold mb-4">{{ patientName || '환자' }}님,</h2>
        <p class="text-xl font-bold mb-8">검사가 완료되었습니다.<br>패드를 데스크로 반납해주세요.</p>

        <div class="mt-6">
            <button @click="emit('confirm')"
                class="w-full max-w-xs px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
                검사완료
            </button>
        </div>
    </div>
</template>
