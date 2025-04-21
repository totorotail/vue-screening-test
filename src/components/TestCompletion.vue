<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

defineProps<{
    patientName: string
}>();

// 검사완료 → 관리자 모드로 이동
const goToReturnPage = () => {
    const patientId = route.query.patientId;
    if (patientId) {
        router.push({
            name: 'ReturnToAdmin',
            query: {
                patientId: String(patientId),
                patientName: String(route.query.patientName || '')
            }
        });
    } else {
        alert('환자 정보를 찾을 수 없습니다.');
    }
};
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-55 shadow-md rounded-lg text-center mt-1">
        <h2 class="text-2xl font-bold mb-4">{{ patientName || '환자' }}님,</h2>
        <p class="text-xl font-bold mb-8">검사가 완료되었습니다.<br />패드를 데스크로 반납해주세요.</p>

        <div class="mt-6">
            <button @click="goToReturnPage"
                class="w-full max-w-xs px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition">
                검사완료
            </button>
        </div>
    </div>
</template>
