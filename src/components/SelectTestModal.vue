<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTestStore } from '../stores/testStore';

const emit = defineEmits(['close', 'confirm']);
const testStore = useTestStore();
const selectedTests = ref<string[]>([]);

// ✅ 검사 개수 업데이트
const selectedCount = computed(() => selectedTests.value.length);

// ✅ 검사 선택 핸들러
const toggleSelection = (testId: string) => {
    if (selectedTests.value.includes(testId)) {
        selectedTests.value = selectedTests.value.filter(id => id !== testId);
    } else {
        selectedTests.value.push(testId);
    }
};
</script>

<template>
    <!-- ✅ 모달 배경 유지 -->
    
        <!-- ✅ 모달 창 -->
        <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[700px]">
            <div class="flex justify-between items-center border-b pb-3">
                <h2 class="text-lg font-bold">검사하기</h2>
                <button @click="emit('close')" class="text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
            </div>

            <p class="mt-4 font-semibold">총 {{ selectedCount }}가지 검사</p>
            <div class="grid grid-cols-2 gap-2 mt-4">
                <div v-for="test in testStore.testCategories" :key="test.id" class="flex items-center">
                    <input type="checkbox" :id="test.id" :checked="selectedTests.includes(test.id)"
                        @change="toggleSelection(test.id)" class="mr-2">
                    <label :for="test.id" class="cursor-pointer">{{ test.name }}</label>
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <button @click="emit('confirm', selectedTests)"
                    :class="['px-4 py-2 rounded-lg transition', selectedCount > 0 ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-500']"
                    :disabled="selectedCount === 0">
                    NEXT
                </button>
            </div>
        </div>
    
</template>