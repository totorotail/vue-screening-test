<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const agreed = ref(false);
const emit = defineEmits(['update:agreed']);

const toggleAgreement = () => {
    emit('update:agreed', agreed.value);
};
</script>

<template>
    <div class="p-6 bg-gray-100 rounded-lg">
        <h2 class="text-xl font-bold">개인정보 수집 및 이용 동의</h2>
        <p class="mt-2 text-sm text-gray-600">
            서비스 이용을 위해 개인정보를 수집합니다.
        </p>
        <label class="block mt-4">
            <input type="checkbox" v-model="agreed" @change="toggleAgreement" class="mr-2" />
            전체 약관에 동의합니다.
        </label>
    </div>
</template>
