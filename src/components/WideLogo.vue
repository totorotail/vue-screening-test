<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { ref, watch, defineProps, nextTick } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass, faUserPlus } from '@fortawesome/free-solid-svg-icons';

const router = useRouter();
const route = useRoute();

const props = defineProps({
    showSearch: Boolean, // 검색창 및 버튼 표시 여부
    userPlan: String // 현재 사용 중인 플랜
});

// 검색어 상태 변수
const searchQuery = ref(route.query.search || '');

// 검색 실행 함수 (환자리스트 페이지로 이동)
const searchPatients = async () => {
    const query = String(searchQuery.value || '').trim(); // 문자열 변환 후 trim() 적용

    await router.push({ path: '/patient-list', query: query ? { search: query } : {} });

    // Vue의 반응형 시스템이 변경 사항을 즉시 감지하도록 `nextTick()` 사용
    await nextTick();
};

// 병원정보 페이지로 이동하는 함수
const goToHospitalInfo = () => {
    router.push('/hospital-info');
};

// 환자등록 페이지로 이동하는 함수
const goToPatientRegistration = () => {
    router.push('/patient-registration');
};

// URL Query 변경 감지하여 `searchQuery` 업데이트
watch(() => route.query.search, (newSearch) => {
    searchQuery.value = newSearch || '';
});
</script>

<template>
    <div class="flex items-center justify-between bg-blue-500 px-6 py-3 rounded-full w-[90%] max-w-[1400px] mx-auto h-16">
        <!-- 로고 -->
        <div class="flex items-center">
            <img src="../assets/logo-s.png" alt="BRAINcheck Logo" class="h-8" />
            <span class="text-white text-lg font-bold ml-2">BRAINcheck</span>

            <!-- 검색창 및 환자등록 버튼 -->
            <div v-if="props.showSearch" class="flex items-center space-x-3 ml-6">
                <!-- 검색창 -->
                <div class="relative flex items-center w-64">
                    <input v-model="searchQuery" type="text" placeholder="환자명 검색"
                        class="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-white"
                        @keyup.enter="searchPatients">
                    <FontAwesomeIcon :icon="faMagnifyingGlass" class="absolute right-3 text-gray-500 cursor-pointer"
                        @click="searchPatients" />
                </div>

                <!-- 환자등록 버튼 -->
                <button @click="goToPatientRegistration"
                    class="bg-white text-blue-500 px-4 py-2 rounded-full font-semibold shadow flex items-center">
                    <FontAwesomeIcon :icon="faUserPlus" class="mr-2" /> 환자등록
                </button>
            </div>
        </div>

        <!-- 프로필 이미지 및 플랜 -->
        <div v-if="props.showSearch" class="relative flex items-center">
            <img src="../assets/profile.png" alt="User Profile"
                class="w-10 h-10 rounded-full border border-white cursor-pointer"
                @click="goToHospitalInfo" />
            <span class="bg-black text-white text-xs px-2 py-1 rounded-full absolute right-7 -bottom-1">
                {{ props.userPlan }}
            </span>
        </div>
    </div>
</template>

<style scoped>
</style>