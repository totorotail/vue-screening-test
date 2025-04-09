<script setup lang="ts">
defineProps({
    show: Boolean,
    selectedPlan: String,
});
const emit = defineEmits(["confirm", "close"]);
</script>

<template>
    <div v-if="show" class="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
        <div class="bg-white p-12 rounded-lg shadow-lg w-96 text-center">
            <p class="text-lg font-bold">STARTER 플랜에선 20명의 환자만 등록이 가능합니다.</p>
            <p class="mt-2 mb-6">플랜을 바꾸겠습니까?</p>
            <div class="flex justify-center space-x-4">
                <button @click="emit('close')" class="px-6 py-2 border rounded-full hover:bg-gray-200 transition">그만하기</button>
                <button @click="emit('confirm')" class="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">계속하기</button>
            </div>
        </div>
    </div>
</template>