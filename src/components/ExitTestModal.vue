<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// props 정의: 모달 표시 여부
const props = defineProps<{ show: boolean }>();

// emits 정의: 부모 컴포넌트로 이벤트 전달
const emit = defineEmits(['close', 'exit']);

// '계속하기' 버튼 클릭 시 모달 닫기
const continueTest = () => {
    emit('close');
};

// '그만하기' 버튼 클릭 시 환자 상세페이지로 이동
const exitToPatientDetail = () => {
    emit('exit');
};
</script>

<template>
    <div v-if="props.show" class="fixed inset-0 flex items-center justify-center bg-opacity-30 backdrop-blur-sm">
        <div class="bg-white w-96 p-6 rounded-lg shadow-lg text-center">
            <h2 class="text-xl font-bold mb-4">검사가 진행중입니다.</h2>
            <p class="text-gray-600 mb-6">계속 진행하시겠습니까?</p>

            <div class="flex justify-center space-x-4">
                <button @click="exitToPatientDetail"
                    class="px-4 py-2 border border-gray-500 text-gray-700 rounded-lg hover:bg-gray-100 transition">
                    그만하기
                </button>
                <button @click="continueTest"
                    class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    계속하기
                </button>
            </div>
        </div>
    </div>
</template>
