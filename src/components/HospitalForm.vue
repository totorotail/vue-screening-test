<script setup lang="ts">
import { ref, computed } from 'vue';

const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const hospitalName = ref('');
const location = ref('');
const errorMessage = ref('');
const showEmailError = ref(false);
const showPasswordError = ref(false);
const termsAgreed = ref([false, false, false, false]);

const hospitalLocations = ['서울', '경기도', '충청도', '전라도', '강원도', '경상도'];

const emit = defineEmits(['submit']);

const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

const checkEmail = () => {
    showEmailError.value = email.value !== '' && !validateEmail(email.value);
};

const checkPassword = () => {
    showPasswordError.value = password.value !== '' && confirmPassword.value !== '' && password.value !== confirmPassword.value;
};

// 전체 약관 동의 처리
const handleAllTermsChange = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked;
    termsAgreed.value = termsAgreed.value.map(() => checked);
};

// 가입완료 버튼 활성화 조건 계산
const isFormValid = computed(() => {
    const isInputValid = email.value !== '' && 
                         password.value !== '' && 
                         confirmPassword.value !== '' && 
                         password.value === confirmPassword.value &&
                         hospitalName.value !== '' && 
                         location.value !== '' &&
                         !showEmailError.value &&
                         !showPasswordError.value;
    
    // 필수 약관 (첫 3개) 동의 확인
    const isTermsValid = termsAgreed.value[0] && termsAgreed.value[1] && termsAgreed.value[2];
    
    return isInputValid && isTermsValid;
});

const handleSubmit = () => {
    // 입력 유효성 검사
    checkEmail();
    checkPassword();
    
    if (!email.value || !password.value || !confirmPassword.value || !hospitalName.value || !location.value) {
        errorMessage.value = '모든 필드를 입력해주세요.';
        return;
    }
    
    if (password.value !== confirmPassword.value) {
        errorMessage.value = '비밀번호가 일치하지 않습니다.';
        return;
    }
    
    // 필수 약관 동의 확인 (첫 3개는 필수)
    if (!termsAgreed.value[0] || !termsAgreed.value[1] || !termsAgreed.value[2]) {
        errorMessage.value = '필수 약관에 모두 동의해주세요.';
        return;
    }
    
    emit('submit', { 
        email: email.value,
        password: password.value,
        hospitalName: hospitalName.value, 
        location: location.value 
    });
};
</script>

<template>
    <div class="max-w-[500px] mx-auto">
        <h2 class="text-lg font-bold text-center mb-6">회원가입</h2>

        <div class="flex flex-col space-y-4">
            <div class="flex flex-col">
                <label class="text-xs text-gray-700 mb-1">이메일 *</label>
                <input 
                    v-model="email" 
                    type="email" 
                    placeholder="Example@example.com"
                    class="w-full p-2.5 border rounded border-gray-300 bg-white" 
                    @blur="checkEmail"
                />
                <p v-if="showEmailError" class="text-orange-500 text-xs mt-1">이메일을 정확히 입력해주세요.</p>
            </div>

            <div class="flex flex-col">
                <label class="text-xs text-gray-700 mb-1">비밀번호 *</label>
                <input 
                    v-model="password" 
                    type="password" 
                    placeholder="영문 소문자, 대문자, 숫자 8자리 이상"
                    class="w-full p-2.5 border rounded border-gray-300 bg-white" 
                />
                <p v-if="showPasswordError" class="text-orange-500 text-xs mt-1">비밀번호가 맞지 않습니다.</p>
            </div>

            <div class="flex flex-col">
                <label class="text-xs text-gray-700 mb-1">비밀번호 확인 *</label>
                <input 
                    v-model="confirmPassword" 
                    type="password" 
                    placeholder="••••••••••"
                    class="w-full p-2.5 border rounded border-gray-300 bg-white" 
                    @blur="checkPassword"
                />
            </div>

            <div class="flex flex-col">
                <label class="text-xs text-gray-700 mb-1">병원명 *</label>
                <input 
                    v-model="hospitalName" 
                    type="text" 
                    placeholder="병원명을 입력해주세요"
                    class="w-full p-2.5 border rounded border-gray-300 bg-white" 
                />
            </div>

            <div class="flex flex-col">
                <label class="text-xs text-gray-700 mb-1">병원위치 *</label>
                <select 
                    v-model="location" 
                    class="w-full p-2.5 border rounded border-gray-300 bg-white"
                >
                    <option value="">선택</option>
                    <option v-for="loc in hospitalLocations" :key="loc" :value="loc">
                        {{ loc }}
                    </option>
                </select>
            </div>

            <!-- 약관 동의 섹션 -->
            <div class="mt-2">
                <div class="flex items-center">
                    <input 
                        type="checkbox" 
                        id="allTerms"
                        class="mr-2 h-4 w-4"
                        :checked="termsAgreed.every(t => t)"
                        @change="handleAllTermsChange"
                    >
                    <label for="allTerms" class="text-sm font-bold">전체 약관에 동의합니다.</label>
                </div>
                
                <div class="space-y-2 mt-2 pl-6">
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms1" 
                            v-model="termsAgreed[0]"
                            class="mr-2 h-4 w-4"
                        >
                        <label for="terms1" class="text-xs text-gray-700">(필수) 이용약관에 동의 합니다.</label>
                        <button class="ml-auto text-xs text-gray-500">보기</button>
                    </div>
                    
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms2" 
                            v-model="termsAgreed[1]"
                            class="mr-2 h-4 w-4"
                        >
                        <label for="terms2" class="text-xs text-gray-700">(필수) 개인정보 수집 및 이용에 대해 동의합니다.</label>
                        <button class="ml-auto text-xs text-gray-500">보기</button>
                    </div>
                    
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms3" 
                            v-model="termsAgreed[2]"
                            class="mr-2 h-4 w-4"
                        >
                        <label for="terms3" class="text-xs text-gray-700">(필수) 만 14세 이상입니다.</label>
                        <button class="ml-auto text-xs text-gray-500">보기</button>
                    </div>
                    
                    <div class="flex items-center">
                        <input 
                            type="checkbox" 
                            id="terms4" 
                            v-model="termsAgreed[3]"
                            class="mr-2 h-4 w-4"
                        >
                        <label for="terms4" class="text-xs text-gray-700">(선택) 이벤트 및 마케팅 활용에 동의합니다.</label>
                        <button class="ml-auto text-xs text-gray-500">보기</button>
                    </div>
                </div>
            </div>

            <p v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</p>

            <div class="flex justify-center mt-4">
                <button 
                    @click="handleSubmit"
                    :disabled="!isFormValid" 
                    :class="[
                        'w-32 py-2 text-sm rounded-full transition',
                        isFormValid 
                            ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    ]"
                >
                    NEXT
                </button>
            </div>
        </div>
    </div>
</template>