<script setup lang="ts">
defineProps<{
  email: string;
  hospitalName: string;
  location: string;
  plan: string;
}>();

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
        <div>{{ location }}</div>
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