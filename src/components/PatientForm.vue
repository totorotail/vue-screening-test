<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
const name = ref('');
const idNumber = ref('');
const birthDate = ref('');
const phone = ref('');
const patientNumber = ref('');
const showIdNumberError = ref(false);
const showPhoneError = ref(false);
const isFocused = ref(false);

const emit = defineEmits(['submit']);

// 주민등록번호 형식 검증
const validateIdNumber = () => {
    const regex = /^\d{6}-\d{7}$/;
    // 주민번호가 비어있으면 에러 표시하지 않음
    if (!idNumber.value) {
        showIdNumberError.value = false;
        return false;
    }

    // 형식이 맞는지 확인 - 원본 값으로 검증
    const isValid = regex.test(idNumber.value);
    showIdNumberError.value = !isValid;
    return isValid;
};

// 주민등록번호에서 생년월일 추출
const extractBirthDate = () => {
    if (idNumber.value.length >= 6) {
        birthDate.value = `${idNumber.value.substring(0, 2)}.${idNumber.value.substring(2, 4)}.${idNumber.value.substring(4, 6)}`;
    }
};

// 주민번호 마스킹 처리 (화면 표시용)
const maskIdNumber = (value: string) => {
    if (!value) return '';
    const parts = value.split('-');
    if (parts.length !== 2) return value;

    const first = parts[0];
    let second = parts[1];

    // 뒷 7자리 중 첫 번째 자리는 유지하고 나머지 6자리만 마스킹
    if (second.length > 1) {
        second = second.charAt(0) + '*'.repeat(Math.min(6, second.length - 1));
    }

    return `${first}-${second}`;
};

// 주민번호 입력 처리
const handleIdNumberInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    let raw = target.value.replace(/[^\d]/g, '');

    if (raw.length > 13) raw = raw.slice(0, 13);
    if (raw.length > 6) {
        idNumber.value = `${raw.slice(0, 6)}-${raw.slice(6)}`;
    } else {
        idNumber.value = raw;
    }

    extractBirthDate();
    validateIdNumber();
};

// 연락처 형식 검증
const validatePhone = () => {
    const regex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    if (!phone.value) {
        showPhoneError.value = false;
        return false;
    }
    const isValid = regex.test(phone.value);
    showPhoneError.value = !isValid;
    return isValid;
};

// 환자번호 중복 확인
const checkDuplicatePatientId = () => {
    return patientNumber.value !== '' && authStore.isPatientIdDuplicate(patientNumber.value);
};

// 폼 유효성 검사
const isFormValid = computed(() => {
    return name.value !== '' &&
        idNumber.value !== '' &&
        validateIdNumber() &&
        phone.value !== '' &&
        validatePhone() &&
        patientNumber.value !== '' &&
        !checkDuplicatePatientId();
});

// 환자 등록 버튼 클릭 시 실행
const handleSubmit = () => {
    if (!isFormValid.value) return;

    emit('submit', {
        name: name.value,
        patientNumber: patientNumber.value,
        birthDate: birthDate.value,
        idNumber: idNumber.value, // 원본 값 전달
        phone: phone.value,
        lastExam: null // 처음 등록된 환자는 최근 검사 기록 없음
    });
};

// 값이 변경될 때마다 유효성 검사
watch(phone, validatePhone);
</script>

<template>
    <div class="p-8 bg-white shadow-lg rounded-lg w-full max-w-[600px] mx-auto">
        <h2 class="text-xl font-bold text-center mb-6">환자등록</h2>

        <div class="flex flex-col space-y-4">
            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">환자명 *</label>
                <input v-model="name" type="text" class="w-full p-3 border rounded mt-1" placeholder="환자명 입력" />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">주민번호 *</label>
                <div class="relative">
                    <input :value="isFocused ? idNumber : maskIdNumber(idNumber)" @focus="isFocused = true"
                        @blur="isFocused = false" @input="handleIdNumberInput" type="text"
                        class="w-full p-3 border rounded mt-1" placeholder="000000-0000000" />
                    <p v-if="showIdNumberError" class="text-orange-500 text-sm mt-1">주민번호를 정확히 입력해주세요.</p>
                </div>
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">생년월일</label>
                <input v-model="birthDate" type="text" class="w-full p-3 border rounded mt-1" readonly />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">연락처 *</label>
                <input v-model="phone" type="text" class="w-full p-3 border rounded mt-1" placeholder="010-0000-0000" />
                <p v-if="showPhoneError" class="text-orange-500 text-sm mt-1">연락처를 정확히 입력해주세요.</p>
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">환자번호 *</label>
                <input v-model="patientNumber" type="text" class="w-full p-3 border rounded mt-1"
                    placeholder="환자번호 입력" />
                <p v-if="checkDuplicatePatientId()" class="text-orange-500 text-sm mt-1">중복된 환자번호가 있습니다.</p>
            </div>

            <div class="flex justify-center my-6">
                <button @click="handleSubmit" :disabled="!isFormValid" :class="[
                    'w-32 py-3 rounded-full transition',
                    isFormValid
                        ? 'bg-blue-500 hover:bg-blue-600 text-white'
                        : 'bg-blue-200 text-white cursor-not-allowed'
                ]">
                    NEXT
                </button>
            </div>
        </div>
    </div>

</template>