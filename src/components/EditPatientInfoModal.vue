<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

// ✅ 부모 컴포넌트에서 props로 환자 데이터 받기
const props = defineProps<{ patient: any, showModal: boolean }>();
const emit = defineEmits(['close', 'updatePatient']);

// ✅ 모달창에서 사용할 환자 정보 상태
const editedPatient = ref({
    name: '',
    idNumber: '',
    phone: '',
    patientNumber: ''
});

// ✅ 기존 환자 정보를 모달창에 로드
watch(() => props.patient, (newPatient) => {
    if (newPatient) {
        editedPatient.value = { ...newPatient };
    }
}, { immediate: true });

// ✅ 환자 정보 업데이트 함수
const saveChanges = () => {
    emit('updatePatient', editedPatient.value);
    emit('close'); // 모달 닫기
};

// ✅ 모달 닫기 함수
const closeModal = () => {
    emit('close');
};
</script>

<template>
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-white w-[600px] p-6 rounded-lg shadow-lg">
            <div class="flex justify-between items-center border-b pb-3">
                <h2 class="text-xl font-semibold">환자 정보 수정</h2>
                <button @click="closeModal" class="text-gray-600 hover:text-gray-800 text-2xl">&times;</button>
            </div>

            <div class="mt-4">
                <label class="block font-semibold">환자명 *</label>
                <input v-model="editedPatient.name" type="text" class="w-full p-2 border rounded mt-1"
                    placeholder="환자명 입력" />

                <label class="block mt-4 font-semibold">주민번호 *</label>
                <input v-model="editedPatient.idNumber" type="text" class="w-full p-2 border rounded mt-1"
                    placeholder="000000-0000000" />

                <label class="block mt-4 font-semibold">연락처 *</label>
                <input v-model="editedPatient.phone" type="text" class="w-full p-2 border rounded mt-1"
                    placeholder="010-0000-0000" />

                <label class="block mt-4 font-semibold">환자번호 *</label>
                <input v-model="editedPatient.patientNumber" type="text" class="w-full p-2 border rounded mt-1"
                    placeholder="환자번호 입력" />

                <p v-if="authStore.isPatientIdDuplicate(editedPatient.patientNumber)" class="text-red-500 text-sm mt-1">
                    동일한 환자번호가 있습니다.
                </p>
            </div>

            <div class="flex justify-end mt-6">
                <button @click="closeModal" class="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg mr-2">취소</button>
                <button @click="saveChanges" class="px-4 py-2 bg-blue-500 text-white rounded-lg">저장</button>
            </div>
        </div>
    </div>
</template>
