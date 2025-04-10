<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

// 타입 정의
interface Patient {
    patientNumber: string;
    name: string;
    birthDate: string;
    idNumber: string;
    phone: string;
    lastExam: string | null;
}

// props 정의
const props = defineProps<{
    patients: Patient[];
    filteredPatients: Patient[];
    paginatedPatients: Patient[];
    searchQuery: string;
    currentPage: number;
    itemsPerPage: number;
    getGender: (idNumber: string) => string;
    getDaysAgo: (examDate: string | null) => string;
}>();

// 이벤트 정의
const emit = defineEmits<{
    (e: 'register'): void;
    (e: 'select', patientNumber: string): void;
}>();
</script>

<template>
    <!-- 검색 전 환자가 없는 경우 -->
    <div v-if="props.patients.length === 0 && !props.searchQuery"
        class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
        <p class="text-gray-600 text-lg font-semibold">등록된 환자가 없습니다.<br>환자를 등록해주세요.</p>
        <img src="../assets/no-patient.png" alt="No Patients" class="w-64 mt-4" />
        <button @click="emit('register')"
            class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
            환자등록
        </button>
    </div>

    <!-- 검색 후 검색 결과가 없는 경우 -->
    <div v-else-if="props.filteredPatients.length === 0 && props.searchQuery"
        class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg flex flex-col items-center">
        <p class="text-gray-600 text-lg font-semibold">
            '{{ props.searchQuery }}'이 없습니다.
        </p>
        <button @click="emit('register')"
            class="mt-4 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition">
            환자등록
        </button>
    </div>

    <!-- 환자가 있는 경우 -->
    <div v-else class="w-[90%] max-w-[1400px] bg-white p-8 shadow-lg rounded-lg">
        <table class="w-full border-collapse">
            <thead>
                <tr class="border-b border-gray-300 text-left text-gray-700">
                    <th class="p-3">NO</th>
                    <th class="p-3">환자명</th>
                    <th class="p-3">환자번호</th>
                    <th class="p-3">생년월일</th>
                    <th class="p-3">성별</th>
                    <th class="p-3">번호</th>
                    <th class="p-3">최근검사</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(patient, index) in props.paginatedPatients" :key="patient.patientNumber"
                    class="border-b border-gray-200 cursor-pointer hover:bg-gray-100"
                    @click="emit('select', patient.patientNumber)">
                    <td class="p-3">{{ (props.currentPage - 1) * props.itemsPerPage + index + 1 }}</td>
                    <td class="p-3">{{ patient.name }}</td>
                    <td class="p-3">{{ patient.patientNumber }}</td>
                    <td class="p-3">{{ patient.birthDate }}</td>
                    <td class="p-3">{{ props.getGender(patient.idNumber) }}</td>
                    <td class="p-3">{{ patient.phone }}</td>
                    <td class="p-3">{{ props.getDaysAgo(patient.lastExam) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>