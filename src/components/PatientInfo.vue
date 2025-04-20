<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ patient: any }>();
const emit = defineEmits(['editPatient']);

// 성별 판별 (주민등록번호의 7번째 숫자 기준)
const gender = computed(() => {
    const rrn = props.patient?.residentRegistrationNumber || '';
    const genderDigit = rrn.charAt(7);
    if (!genderDigit) return '없음';
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
});

// 생년월일 포맷 (주민등록번호 앞 6자리 → YY.MM.DD)
const formattedBirthDate = computed(() => {
    const rrn = props.patient?.residentRegistrationNumber || '';
    if (rrn.length < 6) return '없음';
    const year = rrn.slice(0, 2);
    const month = rrn.slice(2, 4);
    const day = rrn.slice(4, 6);

    // 성별 식별자로 2000년대/1900년대 판단
    const genderDigit = rrn.charAt(7);
    const fullYear = genderDigit === '3' || genderDigit === '4' ? `20${year}` : `19${year}`;
    return `${fullYear}.${month}.${day}`;
});
</script>

<template>
    <div class="flex justify-between items-center">
        <p class="font-bold text-lg">{{ patient?.name || '없음' }}</p>
        <img src="../assets/setting-icon.png" alt="설정" class="w-6 h-6 cursor-pointer" @click="$emit('editPatient')" />
    </div>

    <div class="mt-4">
        <div class="flex space-x-4 text-gray-600 mt-1">
            <span>{{ formattedBirthDate }}</span>
            <span>|</span>
            <span>{{ gender }}</span>
            <span>|</span>
            <span>{{ patient?.phoneNumber || '없음' }}</span>
            <span>|</span>
            <span>{{ patient?.patientNumber || '없음' }}</span>
        </div>
    </div>
</template>
