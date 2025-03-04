<script setup lang="ts">
import LoginForm from '../components/LoginForm.vue';
</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div class="w-[500px] bg-white p-10 shadow-lg rounded-lg">
            <div class="flex justify-center items-center bg-blue-500 p-3 rounded-full w-[200px] mx-auto mb-6">
                <img src="../assets/logo-s.png" alt="Logo" class="h-8" />
                <span class="text-white text-lg font-bold ml-2">BRAINcheck</span>
            </div>

            <LoginForm />
        </div>
    </div>
</template>

<style scoped></style>
