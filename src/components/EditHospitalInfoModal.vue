<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from 'vue';

// props 정의: 병원명, 위치, 모달 표시 여부
const props = defineProps({
    show: Boolean,
    hospitalName: String,
    location: String,
});

// emits 정의: 저장(update), 닫기(close)
const emit = defineEmits(['update', 'close']);

// 입력값 상태
const password = ref('');
const confirmPassword = ref('');
const newHospitalName = ref(props.hospitalName);
const newLocation = ref(props.location);
const passwordError = ref('');

// 지역 키 정의
type LocationKey = 'SEOUL' | 'GYEONGGI' | 'CHUNGCHEONG' | 'JEOLLA' | 'GANGWON' | 'GYEONGSANG';
const hospitalLocations: LocationKey[] = ['SEOUL', 'GYEONGGI', 'CHUNGCHEONG', 'JEOLLA', 'GANGWON', 'GYEONGSANG'];
const locationNames: Record<LocationKey, string> = {
    SEOUL: '서울',
    GYEONGGI: '경기도',
    CHUNGCHEONG: '충청도',
    JEOLLA: '전라도',
    GANGWON: '강원도',
    GYEONGSANG: '경상도'
};

// 비밀번호 일치 확인
watch([password, confirmPassword], () => {
    if (password.value && confirmPassword.value && password.value !== confirmPassword.value) {
        passwordError.value = '비밀번호가 일치하지 않습니다.';
    } else {
        passwordError.value = '';
    }
});

// 저장 버튼 활성화 조건
const isFormValid = computed(() => {
    return (
        password.value !== '' &&
        confirmPassword.value !== '' &&
        password.value === confirmPassword.value &&
        newHospitalName.value !== '' &&
        newLocation.value !== ''
    );
});

// 저장 버튼 클릭 시
const saveHospitalInfo = () => {
    if (!isFormValid.value) return;
    emit('update', {
        hospitalName: newHospitalName.value,
        location: newLocation.value,
        password: password.value,
    });
};
</script>

<template>
    <div v-if="show"
        class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg w-[500px]">
        <!-- 헤더 -->
        <div class="p-4 flex justify-between items-center bg-white rounded-t-lg">
            <h2 class="text-lg font-medium">병원정보 수정</h2>
            <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
                <img src="../assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>

        <!-- 본문 -->
        <div class="mx-1 my-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <div class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">새 비밀번호 *</label>
                    <input v-model="password" type="password" class="w-full p-2 border border-gray-200 rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인 *</label>
                    <input v-model="confirmPassword" type="password"
                        class="w-full p-2 border border-gray-200 rounded-md" />
                    <p v-if="passwordError" class="text-orange-500 text-xs mt-1">{{ passwordError }}</p>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">병원명</label>
                    <input v-model="newHospitalName" type="text" class="w-full p-2 border border-gray-200 rounded-md" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">병원위치</label>
                    <select v-model="newLocation" class="w-full p-2 border border-gray-200 rounded-md appearance-none">
                        <option v-for="loc in hospitalLocations" :key="loc" :value="loc">
                            {{ locationNames[loc] }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- 버튼 -->
            <div class="px-6 pb-6 flex justify-center">
                <button @click="saveHospitalInfo"
                    class="w-32 py-2 rounded-full text-sm transition enabled:bg-blue-500 enabled:hover:bg-blue-600 enabled:text-white disabled:bg-blue-200 disabled:text-white"
                    :disabled="!isFormValid">
                    CONFIRM
                </button>
            </div>
        </div>
    </div>
</template>