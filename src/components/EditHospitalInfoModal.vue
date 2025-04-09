<script setup lang="ts">
import { ref, defineProps, defineEmits, computed, watch } from "vue";
import { useAuthStore } from "../stores/authStore";

const props = defineProps({
    show: Boolean,
    hospitalName: String,
    location: String,
});

const emit = defineEmits(["close", "update"]);

const authStore = useAuthStore();
const currentUserPassword = computed(() => authStore.user?.password || ""); // 현재 로그인한 유저의 비밀번호

const password = ref("");
const confirmPassword = ref("");
const newHospitalName = ref(props.hospitalName);
const newLocation = ref(props.location);
const passwordError = ref("");

// 병원 위치 옵션
const hospitalLocations = ['서울', '경기도', '충청도', '전라도', '강원도', '경상도'];

// 비밀번호 확인 시 유효성 검사
const checkPassword = () => {
    if (password.value !== confirmPassword.value) {
        passwordError.value = "비밀번호가 맞지 않습니다.";
    } else {
        passwordError.value = "";
    }
};

// 비밀번호나 비밀번호 확인이 변경될 때마다 검사
watch([password, confirmPassword], () => {
    if (password.value && confirmPassword.value) {
        checkPassword();
    }
});

// 폼 유효성 검사
const isFormValid = computed(() => {
    return password.value !== "" &&
        confirmPassword.value !== "" &&
        password.value === confirmPassword.value &&
        newHospitalName.value !== "" &&
        newLocation.value !== "";
});

// 저장 버튼 클릭 시 실행
const saveHospitalInfo = () => {
    checkPassword();
    
    if (password.value === confirmPassword.value) {
        if (password.value === currentUserPassword.value) {
            emit("update", { hospitalName: newHospitalName.value, location: newLocation.value });
        } else {
            passwordError.value = "비밀번호가 일치하지 않습니다.";
        }
    }
};
</script>

<template>
    <div v-if="show" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-50 rounded-lg shadow-lg w-[500px]">
        <!-- 헤더 영역 -->
        <div class="p-4 flex justify-between items-center bg-white rounded-t-lg">
            <h2 class="text-lg font-medium">병원정보 수정</h2>
            <button @click="emit('close')">
                <img src="src/assets/close-icon.png" class="w-5 h-5" alt="닫기" />
            </button>
        </div>
        
        <!-- 본문과 버튼 영역을 감싸는 둥근 박스 -->
        <div class="mx-1 my-1 bg-white rounded-lg overflow-hidden shadow-sm">
            <!-- 본문 영역 -->
            <div class="p-6">
                <div class="space-y-5">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호 *</label>
                        <input v-model="password" type="password" 
                            class="w-full px-3 py-3 border border-gray-200 rounded-md">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">비밀번호 확인 *</label>
                        <input v-model="confirmPassword" type="password" @blur="checkPassword"
                            class="w-full px-3 py-3 border border-gray-200 rounded-md">
                        <p v-if="passwordError" class="text-orange-500 text-xs mt-1">{{ passwordError }}</p>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">병원명</label>
                        <input v-model="newHospitalName" type="text"
                            class="w-full px-3 py-3 border border-gray-200 rounded-md">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">병원위치</label>
                        <select v-model="newLocation" 
                            class="w-full px-3 py-3 border border-gray-200 rounded-md appearance-none">
                            <option v-for="loc in hospitalLocations" :key="loc" :value="loc">
                                {{ loc }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- 버튼 영역 -->
            <div class="px-6 pb-6 flex justify-center">
                <button @click="saveHospitalInfo" 
                    class="w-32 py-2 rounded-full text-sm transition
                           disabled:bg-blue-200 disabled:text-white
                           enabled:bg-blue-500 enabled:hover:bg-blue-600 enabled:text-white" 
                    :disabled="!isFormValid">
                    CONFIRM
                </button>
            </div>
        </div>
    </div>
</template>