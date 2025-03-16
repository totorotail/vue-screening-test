<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ patient: any }>();
const emit = defineEmits(['editPatient']);

// ✅ 성별 판별
const gender = computed(() => {
    if (!props.patient || !props.patient.idNumber) return '없음';
    const genderDigit = props.patient.idNumber.charAt(7);
    return genderDigit === '1' || genderDigit === '3' ? '남자' : '여자';
});

// ✅ 생년월일 포맷 변경
const formattedBirthDate = computed(() => {
    return props.patient?.birthDate ? props.patient.birthDate.replace(/-/g, '.') : '없음';
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
            <span>{{ patient?.phone || '없음' }}</span>
            <span>|</span>
            <span>{{ patient?.patientNumber || '없음' }}</span>
        </div>
    </div>
</template>