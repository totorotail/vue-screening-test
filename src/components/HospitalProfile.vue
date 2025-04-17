<script setup lang="ts">
import { computed } from 'vue';

// Props 구조 분해로 선언
const { email, hospitalName, location, plan } = defineProps<{
    email: string;
    hospitalName: string;
    location: string;
    plan: string;
}>();

// 지역 enum → 한글 매핑
const locationNames: Record<string, string> = {
    'SEOUL': '서울',
    'GYEONGGI': '경기도',
    'CHUNGCHEONG': '충청도',
    'JEOLLA': '전라도',
    'GANGWON': '강원도',
    'GYEONGSANG': '경상도'
};

// 한글로 변환된 지역명
const koreanLocation = computed(() => locationNames[location] || location);

defineEmits(['open-edit']);
</script>

<template>
    <div class="w-1/3 bg-white shadow-lg rounded-lg p-6">
        <div class="grid grid-cols-[80px_1fr] gap-1">
            <div class="font-semibold">이메일</div>
            <div>{{ email }}</div>
            <div class="font-semibold">병원이름</div>
            <div>{{ hospitalName }}</div>
            <div class="font-semibold">지역</div>
            <div>{{ koreanLocation }}</div>
            <div class="font-semibold">플랜</div>
            <div>{{ plan }}</div>
        </div>
        <div class="mt-4">
            <button @click="$emit('open-edit')">
                <img src="src/assets/setting-icon.png" class="w-6 h-6" alt="설정" />
            </button>
        </div>
    </div>
</template>