<script setup lang="ts">
defineProps({
    show: Boolean,
    selectedPlan: String,
});
const emit = defineEmits(["confirm", "close"]);
</script>

<template>
    <div v-if="show" class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <p class="text-lg font-bold">STARTER 플랜에선 20명의 환자만 등록이 가능합니다.</p>
        <p class="mt-2">플랜을 바꾸겠습니까?</p>
        <div class="flex justify-center mt-4 space-x-4">
            <button @click="emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-200 transition">그만하기</button>
            <button @click="emit('confirm')" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">계속하기</button>
        </div>
    </div>
</template>