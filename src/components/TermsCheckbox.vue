<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    modelValue: boolean[]
}>();

const emit = defineEmits(['update:modelValue']);

// 전체 약관 동의 상태
const isAllChecked = computed(() => {
    return props.modelValue.every(v => v);
});

// 전체 약관 동의 처리
const handleAllTermsChange = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked;
    emit('update:modelValue', props.modelValue.map(() => checked));
};

// 개별 약관 동의 처리
const updateTerm = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target) {
        const newTerms = [...props.modelValue];
        newTerms[index] = target.checked;
        emit('update:modelValue', newTerms);
    }
};
</script>

<template>
    <div class="mt-2">
        <div class="flex items-center">
            <input type="checkbox" id="allTerms" class="mr-2 h-4 w-4" :checked="isAllChecked"
                @change="handleAllTermsChange">
            <label for="allTerms" class="text-sm font-bold">전체 약관에 동의합니다.</label>
        </div>

        <div class="space-y-2 mt-2 pl-6">
            <div class="flex items-center">
                <input type="checkbox" id="terms1" :checked="modelValue[0]" @change="(event) => updateTerm(0, event)"
                    class="mr-2 h-4 w-4">
                <label for="terms1" class="text-xs text-gray-700">(필수) 이용약관에 동의 합니다.</label>
                <button class="ml-auto text-xs text-gray-500">보기</button>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="terms2" :checked="modelValue[1]" @change="(event) => updateTerm(1, event)"
                    class="mr-2 h-4 w-4">
                <label for="terms2" class="text-xs text-gray-700">(필수) 개인정보 수집 및 이용에 대해 동의합니다.</label>
                <button class="ml-auto text-xs text-gray-500">보기</button>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="terms3" :checked="modelValue[2]" @change="(event) => updateTerm(2, event)"
                    class="mr-2 h-4 w-4">
                <label for="terms3" class="text-xs text-gray-700">(필수) 만 14세 이상입니다.</label>
                <button class="ml-auto text-xs text-gray-500">보기</button>
            </div>

            <div class="flex items-center">
                <input type="checkbox" id="terms4" :checked="modelValue[3]" @change="(event) => updateTerm(3, event)"
                    class="mr-2 h-4 w-4">
                <label for="terms4" class="text-xs text-gray-700">(선택) 이벤트 및 마케팅 활용에 동의합니다.</label>
                <button class="ml-auto text-xs text-gray-500">보기</button>
            </div>
        </div>
    </div>
</template>