<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div class="w-[500px] bg-white p-10 shadow-lg rounded-lg">
            <div class="flex flex-col items-center">
                <img src="/logo.png" alt="BRAINcheck Logo" class="w-32 h-32 mb-4" />
                <h1 class="text-3xl font-bold text-gray-800">BRAINcheck</h1>
            </div>
            <LoginForm />
        </div>
    </div>
</template>

<style scoped></style>
