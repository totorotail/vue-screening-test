<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, computed } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();

const props = defineProps({
    patient: Object,
});

const emit = defineEmits(['close', 'update']);

const editedPatient = ref({
    name: '',
    idNumber: '',
    phone: '',
    patientNumber: '',
});

const showIdNumberError = ref(false);
const showPhoneError = ref(false);
const isIdFocused = ref(false);

// ✅ 주민등록번호 마스킹 함수
const maskIdNumber = (value: string) => {
    const parts = value.split('-');
    if (parts.length !== 2) return value;

    const first = parts[0];
    const second = parts[1];

    if (second.length === 0) return value;
    return `${first}-${second[0]}${'*'.repeat(second.length - 1)}`;
};

// ✅ 주민등록번호 입력 처리
const handleIdNumberInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let raw = target.value.replace(/[^\d]/g, '');
    if (raw.length > 13) raw = raw.slice(0, 13);

    if (raw.length > 6) {
        editedPatient.value.idNumber = `${raw.slice(0, 6)}-${raw.slice(6)}`;
    } else {
        editedPatient.value.idNumber = raw;
    }

    validateIdNumber();
};

// ✅ 주민등록번호 형식 검증
const validateIdNumber = () => {
    const regex = /^\d{6}-\d{7}$/;
    const isValid = regex.test(editedPatient.value.idNumber);
    showIdNumberError.value = editedPatient.value.idNumber !== '' && !isValid;
    return isValid;
};

// ✅ 연락처 형식 검증
const validatePhone = () => {
    const regex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    const isValid = regex.test(editedPatient.value.phone);
    showPhoneError.value = editedPatient.value.phone !== '' && !isValid;
    return isValid;
};

// ✅ 폼 유효성 검사
const isFormValid = computed(() => {
    return editedPatient.value.name !== '' &&
        editedPatient.value.idNumber !== '' &&
        validateIdNumber() &&
        editedPatient.value.phone !== '' &&
        validatePhone() &&
        editedPatient.value.patientNumber !== '';
});

// ✅ props 값 반영
watch(() => props.patient, (newPatient) => {
    if (newPatient) {
        editedPatient.value = {
            name: newPatient.name || '',
            idNumber: newPatient.idNumber || '',
            phone: newPatient.phone || '',
            patientNumber: newPatient.patientNumber || ''
        };
        validateIdNumber();
        validatePhone();
    }
}, { immediate: true });

// ✅ 연락처 자동 검증
watch(() => editedPatient.value.phone, validatePhone);

// ✅ 저장
const savePatientInfo = () => {
    if (!isFormValid.value) return;

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
                        <input :value="isIdFocused ? editedPatient.idNumber : maskIdNumber(editedPatient.idNumber)"
                            @focus="isIdFocused = true" @blur="isIdFocused = false" @input="handleIdNumberInput"
                            type="text" class="w-full p-2 border border-gray-200 rounded-md"
                            placeholder="000000-0000000" />
                        <p v-if="showIdNumberError" class="text-orange-500 text-xs mt-1">
                            주민번호를 정확히 입력해주세요.
                        </p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">연락처 *</label>
                        <input v-model="editedPatient.phone" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="010-0000-0000">
                        <p v-if="showPhoneError" class="text-orange-500 text-xs mt-1">연락처를 정확히 입력해주세요.</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">환자번호 *</label>
                        <input v-model="editedPatient.patientNumber" type="text"
                            class="w-full p-2 border border-gray-200 rounded-md" placeholder="환자번호 입력">
                    </div>
                </div>
            </div>

            <!-- 버튼 영역 -->
            <div class="flex justify-center my-6">
                    <button @click="savePatientInfo" :disabled="!isFormValid" :class="[
                        'w-32 py-3 rounded-full transition',
                        isFormValid
                            ? 'bg-blue-500 hover:bg-blue-600 text-white'
                            : 'bg-blue-200 text-white cursor-not-allowed'
                    ]">
                        CONFIRM
                    </button>
                </div>
        </div>
    </div>
</template>