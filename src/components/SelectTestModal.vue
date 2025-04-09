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
    <div class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg w-[700px]">
        <!-- 헤더 영역 -->
        <div class="p-4 flex justify-between items-center bg-white rounded-t-lg">
            <h2 class="text-lg font-medium">검사하기</h2>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>
        
        <!-- 본문과 버튼 영역을 감싸는 둥근 박스 -->
        <div class="mx-1 my-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <!-- 본문 영역 -->
            <div class="p-6">
                <!-- ✅ 검사 개수 표시 -->
                <p class="mb-4 font-semibold">총 {{ selectedCount }}가지 검사</p>

                <!-- ✅ 검사 리스트 -->
                <div class="grid grid-cols-2 gap-2">
                    <div v-for="test in testStore.testCategories" :key="test.id" class="flex items-center space-x-2">
                        <!-- ✅ 체크박스 -->
                        <input type="checkbox" :id="test.id" :checked="selectedTests.includes(test.id)"
                            @change="toggleSelection(test.id)" class="mr-2 cursor-pointer">

                        <!-- ✅ 검사명 (영문 ID + 한글명) -->
                        <label :for="test.id" class="flex items-center space-x-2 cursor-pointer">
                            <span :class="[test.bg, test.color, 'px-2 py-1 rounded text-xs font-bold']">
                                {{ test.id }}
                            </span>
                            <span class="text-gray-700">{{ test.name }}</span>
                        </label>
                    </div>
                </div>
            </div>
            
            <!-- 버튼 영역 -->
            <div class="px-6 pb-6 flex justify-end">
                <button @click="emit('confirm', selectedTests)"
                    :class="['px-4 py-2 rounded-full text-sm transition', 
                            selectedCount > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500']"
                    :disabled="selectedCount === 0">
                    NEXT
                </button>
            </div>
        </div>
    </div>
</template>