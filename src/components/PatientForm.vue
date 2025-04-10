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

const emit = defineEmits(['submit']);

// ✅ 주민등록번호 형식 검증
const validateIdNumber = () => {
    const regex = /^\d{6}-\d{7}$/;
    showIdNumberError.value = idNumber.value !== '' && !regex.test(idNumber.value);
    return regex.test(idNumber.value);
};

// ✅ 주민등록번호에서 생년월일 추출
const extractBirthDate = () => {
    if (idNumber.value.length >= 6) {
        birthDate.value = `${idNumber.value.substring(0, 2)}.${idNumber.value.substring(2, 4)}.${idNumber.value.substring(4, 6)}`;
    }
    validateIdNumber();
};

// ✅ 주민번호 마스킹 처리
const maskedIdNumber = computed(() => {
    if (!idNumber.value) return '';
    const parts = idNumber.value.split('-');
    if (parts.length !== 2) return idNumber.value;
    
    const first = parts[0];
    const second = parts[1].replace(/./g, '*');
    return `${first}-${second}`;
});

// ✅ 연락처 형식 검증
const validatePhone = () => {
    const regex = /^\d{2,3}-\d{3,4}-\d{4}$/;
    showPhoneError.value = phone.value !== '' && !regex.test(phone.value);
    return regex.test(phone.value);
};

// ✅ 환자번호 중복 확인
const checkDuplicatePatientId = () => {
    return authStore.isPatientIdDuplicate(patientNumber.value);
};

// ✅ 폼 유효성 검사
const isFormValid = computed(() => {
    return name.value !== '' && 
           idNumber.value !== '' && 
           validateIdNumber() && 
           phone.value !== '' && 
           validatePhone() && 
           patientNumber.value !== '' && 
           !checkDuplicatePatientId();
});

// ✅ 환자 등록 버튼 클릭 시 실행
const handleSubmit = () => {
    if (!isFormValid.value) return;

    emit('submit', {
        name: name.value,
        patientNumber: patientNumber.value,
        birthDate: birthDate.value,
        idNumber: idNumber.value,
        phone: phone.value,
        lastExam: null // ✅ 처음 등록된 환자는 최근 검사 기록 없음
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
                <input v-model="idNumber" type="text" class="w-full p-3 border rounded mt-1" placeholder="000000-0000000" @input="extractBirthDate" />
                <p v-if="showIdNumberError" class="text-orange-500 text-sm mt-1">주민번호를 정확히 입력해주세요.</p>
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">생년월일</label>
                <input v-model="birthDate" type="text" class="w-full p-3 border rounded mt-1" readonly />
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">연락처 *</label>
                <input v-model="phone" type="text" class="w-full p-3 border rounded mt-1" placeholder="010-0000-0000" @blur="validatePhone" />
                <p v-if="showPhoneError" class="text-orange-500 text-sm mt-1">연락처를 정확히 입력해주세요.</p>
            </div>

            <div class="flex flex-col">
                <label class="text-gray-700 font-medium">환자번호 *</label>
                <input v-model="patientNumber" type="text" class="w-full p-3 border rounded mt-1" placeholder="환자번호 입력" />
                <p v-if="checkDuplicatePatientId()" class="text-red-500 text-sm mt-1">중복된 환자번호가 있습니다.</p>
            </div>

            <div class="flex justify-center mt-6">
                <button @click="handleSubmit" 
                    :disabled="!isFormValid" 
                    :class="[
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