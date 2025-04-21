<script setup lang="ts">
const props = defineProps<{
    currentTest: string,
    testInfo: any,
    questions: any[],
    responses: (number | null)[],
    isNextEnabled: boolean,
    isLast: boolean
}>();

const emit = defineEmits(['next', 'complete']);
</script>

<template>
    <div class="w-[90%] max-w-[1400px] bg-white px-6 py-14 shadow-md rounded-lg mt-1">
        <div v-if="currentTest">
            <h2 class="text-xl font-bold">{{ testInfo?.description }}</h2>

            <div class="mt-4 max-h-[400px] overflow-y-auto space-y-4">
                <div v-for="(question, qIndex) in questions" :key="question.id" class="border-b pb-2">
                    <p class="font-semibold">{{ question.id }}. {{ question.text }}</p>
                    <div class="mt-2 space-y-1">
                        <label v-for="option in question.options" :key="option.id"
                            class="flex items-center space-x-2 cursor-pointer">
                            <input type="radio" :name="`q${question.id}`" :value="option.id"
                                v-model="props.responses[qIndex]" class="cursor-pointer" />
                            <span>{{ option.text }}</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="flex justify-end mt-6">
                <button v-if="!isLast" @click="emit('next')" :disabled="!isNextEnabled"
                    :class="['px-6 py-3 rounded-full font-bold transition',
                        isNextEnabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-400 cursor-not-allowed']">
                    NEXT
                </button>
                <button v-else @click="emit('complete')" :disabled="!isNextEnabled"
                    :class="['px-6 py-3 rounded-full font-bold transition',
                        isNextEnabled ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-blue-200 text-gray-400 cursor-not-allowed']">
                    CONFIRM
                </button>
            </div>
        </div>
    </div>
</template>
