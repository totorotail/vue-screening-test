<script setup lang="ts">
defineProps<{
    selectedTests: string[],
    currentTestIndex: number,
    showIntroPage: boolean,
    showCompletionPage: boolean,
    testStyles: Record<string, { bg: string; color: string; title: string }>
}>();
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-3 shadow-md rounded-lg">
        <div class="flex items-center space-x-2 overflow-x-auto">
            <template v-for="(test, index) in selectedTests" :key="test">
                <span v-if="index > 0" class="text-gray-400 text-lg">→</span>
                <span class="flex items-center space-x-2">
                    <!-- 뱃지 스타일 -->
                    <span class="px-2 py-1 rounded text-xs font-bold" :style="{
                        backgroundColor: testStyles[test]?.bg,
                        color: testStyles[test]?.color
                    }">
                        {{ test }}
                    </span>
                    <!-- 한글 제목 -->
                    <span :class="index === currentTestIndex ? 'text-black font-bold' : 'text-gray-400'">
                        {{ testStyles[test]?.title }}
                    </span>
                </span>
            </template>
        </div>
    </div>
</template>
