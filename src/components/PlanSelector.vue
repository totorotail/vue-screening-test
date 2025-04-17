<script setup lang="ts">
defineProps<{
  currentPlan: string;
  availablePlans: { name: string; price: string; benefits: string[] }[];
}>();

defineEmits(['select']);
</script>

<template>
    <div class="w-2/3 bg-white shadow-lg rounded-lg p-6">
      <h2 class="text-lg font-bold mb-4">플랜변경</h2>
      <div class="border-b border-gray-200 mb-4 mt-1"></div>
      <div class="w-[80%] mx-auto">
        <div class="flex space-x-4">
          <div v-for="plan in availablePlans" :key="plan.name" class="flex-1 border rounded-lg overflow-hidden">
            <div :class="[
                plan.name === 'STARTER' ? 'bg-gray-100' :
                plan.name === 'BASIC' ? 'bg-blue-500' : 'bg-black',
                'h-2'
              ]"></div>
            <div class="text-center px-3 py-10">
              <h3 class="mb-2">{{ plan.name }}</h3>
              <p class="font-bold mb-4">{{ plan.price }}</p>
  
              <button v-if="currentPlan === plan.name"
                class="w-full py-1 border rounded-lg cursor-not-allowed">
                {{ plan.name }} 플랜중
              </button>
  
              <button v-else @click="$emit('select', plan.name)"
                class="w-full py-1 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                {{ plan.name }} 플랜변경
              </button>
  
              <div class="mt-4 text-left">
                <p v-for="benefit in plan.benefits" :key="benefit" class="text-sm flex items-start">
                  <span class="text-green-600 mr-1 mb-1">✓</span>
                  {{ benefit.replace('✔️ ', '') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>