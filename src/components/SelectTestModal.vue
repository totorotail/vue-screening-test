<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import TestService from '../services/TestService';

const emit = defineEmits(['close', 'confirm']);

interface TestItem {
    acronym: string;
    title: string;
    badgeBgColor: string;
    badgeTextColor: string;
}

const tests = ref<TestItem[]>([]);
const selectedTests = ref<string[]>([]);
const loading = ref(true);

// 검사 개수 계산
const selectedCount = computed(() => selectedTests.value.length);

// 검사 선택 토글
const toggleSelection = (testId: string) => {
    if (selectedTests.value.includes(testId)) {
        selectedTests.value = selectedTests.value.filter(id => id !== testId);
    } else {
        selectedTests.value.push(testId);
    }
};

// 검사 목록 불러오기
const fetchTests = async () => {
    try {
        const response = await TestService.getAllTests();
        tests.value = response.data.map((test: any) => ({
            acronym: test.acronym,
            title: test.title,
            badgeBgColor: test.badgeBgColor,
            badgeTextColor: test.badgeTextColor,
        }));
    } catch (error) {
        console.error('검사 목록 불러오기 실패:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchTests);
</script>

<template>
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg w-[700px]">
        <!-- 헤더 -->
        <div class="p-4 flex justify-between items-center bg-white rounded-t-lg">
            <h2 class="text-lg font-medium">검사하기</h2>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 본문 -->
        <div class="mx-1 my-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <div class="p-6">
                <div v-if="loading" class="text-center text-gray-400 py-8">검사 항목을 불러오는 중입니다...</div>

                <div v-else>
                    <p class="mb-4 font-semibold">총 {{ selectedCount }}가지 검사</p>

                    <div class="grid grid-cols-2 gap-2">
                        <div v-for="test in tests" :key="test.acronym" class="flex items-center space-x-2">
                            <!-- 체크박스 -->
                            <input type="checkbox" :id="test.acronym" :checked="selectedTests.includes(test.acronym)"
                                @change="toggleSelection(test.acronym)" class="mr-2 cursor-pointer">

                            <!-- 뱃지 및 제목 -->
                            <label :for="test.acronym" class="flex items-center space-x-2 cursor-pointer">
                                <span class="px-2 py-1 rounded text-xs font-bold"
                                    :style="{ backgroundColor: test.badgeBgColor, color: test.badgeTextColor }">
                                    {{ test.acronym }}
                                </span>
                                <span class="text-gray-700">{{ test.title }}</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 버튼 -->
            <div class="px-6 pb-6 flex justify-end">
                <button @click="emit('confirm', selectedTests)" :class="[
                    'px-4 py-2 rounded-full text-sm transition',
                    selectedCount > 0 ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-300 text-gray-500'
                ]" :disabled="selectedCount === 0">
                    NEXT
                </button>
            </div>
        </div>
    </div>
</template>
