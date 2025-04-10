<script setup lang="ts">
defineProps<{
    selectedTests: string[],
    currentTestIndex: number,
    showIntroPage: boolean,
    showCompletionPage: boolean
}>();

import { useTestStore } from '../stores/testStore';
const testStore = useTestStore();

const getTestStyle = (testId: string, isActive: boolean) => {
    const test = testStore.testCategories.find(t => t.id === testId);
    return test ? { color: test.color, bg: test.bg, name: test.name, isActive } : { color: '', bg: '', name: '', isActive };
};
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-3 shadow-md rounded-lg">
        <div class="flex items-center space-x-2 overflow-x-auto">
            <template v-for="(test, index) in selectedTests" :key="test">
                <span v-if="index > 0" class="text-gray-400 text-lg">→</span>
                <span class="flex items-center space-x-2">
                    <span :class="[getTestStyle(test, !showIntroPage && !showCompletionPage && index === currentTestIndex).bg,
                    getTestStyle(test, !showIntroPage && !showCompletionPage && index === currentTestIndex).color,
                        'px-3 py-1 rounded-full text-sm font-semibold',
                    index === currentTestIndex ? 'text-black font-bold' : 'text-gray-400']">
                        {{ test }}
                    </span>
                    <span :class="index === currentTestIndex ? 'text-black font-bold' : 'text-gray-400'">
                        {{ getTestStyle(test, index === currentTestIndex).name }}
                    </span>
                </span>
            </template>
        </div>
    </div>
</template>
