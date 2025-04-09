<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const props = defineProps({
    patient: Object, // ✅ 부모 컴포넌트에서 전달된 환자 정보
});

const emit = defineEmits(['close', 'update']);

// ✅ 초기값을 위한 반응형 변수
const editedPatient = ref({
    name: '',
    idNumber: '',
    phone: '',
    patientNumber: '',
});

// ✅ props에서 받은 환자 정보를 반응형 변수에 설정
watch(() => props.patient, (newPatient) => {
    if (newPatient) {
        editedPatient.value = {
            name: newPatient.name || '',
            idNumber: newPatient.idNumber || '',
            phone: newPatient.phone || '',
            patientNumber: newPatient.patientNumber || ''
        };
    }
}, { immediate: true });

// ✅ 저장 버튼 클릭 시 실행
const savePatientInfo = () => {
    // ✅ 환자번호 중복 검사
    const isDuplicate = authStore.isPatientIdDuplicate(editedPatient.value.patientNumber);
    if (isDuplicate && editedPatient.value.patientNumber !== props.patient?.patientNumber) {
        alert('동일한 환자번호가 이미 존재합니다.');
        return;
    }

    emit('update', editedPatient.value);
    emit('close');
};
</script>

<template>
    <div
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg w-[500px]">
        <!-- 헤더 영역 -->
        <div class="p-4 flex justify-between items-center bg-white rounded-t-lg">
            <h2 class="text-lg font-medium">환자 정보 수정</h2>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 본문과 버튼 영역을 감싸는 둥근 박스 -->
        <div class="mx-1 my-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <!-- 본문 영역 -->
            <div class="p-6">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">환자명 *</label>
                        <input v-model="editedPatient.name" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="환자명 입력">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">주민번호 *</label>
                        <input v-model="editedPatient.idNumber" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="000000-0000000">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                        <input v-model="editedPatient.phone" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="010-0000-0000">
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">환자번호 *</label>
                        <input v-model="editedPatient.patientNumber" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="환자번호 입력">
                    </div>
                </div>
            </div>

            <!-- 버튼 영역 -->
            <div class="px-6 pb-6 flex justify-between">
                <button @click="emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-200 transition">
                    취소
                </button>
                <button @click="savePatientInfo"
                    class="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                    CONFIRM
                </button>
            </div>
        </div>
    </div>
</template>
