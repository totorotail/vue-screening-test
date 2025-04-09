<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-white">
        <div class="w-full max-w-[520px] px-8">
            <div class="flex justify-center items-center bg-blue-500 p-3 rounded-full w-[200px] mx-auto mb-12">
                <img src="../assets/logo-s.png" alt="Logo" class="h-6" />
                <span class="text-white text-lg font-bold ml-2">BRAINcheck</span>
            </div>

            <LoginForm />
        </div>
    </div>
</template>

<style scoped></style>