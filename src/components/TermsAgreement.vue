<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const agreed = ref(false);
const emit = defineEmits(['update:agreed']);

const toggleAgreement = () => {
    emit('update:agreed', agreed.value);
};
</script>

<template>
    <div class="p-8 bg-white shadow-md rounded-lg">
        <!-- 타이틀 -->
        <h2 class="text-2xl font-bold text-gray-900">개인정보 수집 및 이용에 대한 동의서</h2>

        <!-- 본문 -->
        <div class="mt-4 text-gray-700 text-base leading-relaxed">
            <p class="font-semibold">개인정보 수집 및 이용에 대한 안내</p>
            <p class="mt-2">
                본 병의원은 고객의 개인정보를 매우 소중하게 생각하며, 고객의 개인정보를 가장 효과적이고 안전하게 보호하기 위하여 최선의 노력을 다하고 있습니다.
                본 병의원은 개인정보보호 관련 주요 법률(정보통신망 이용촉진 및 정보보호 등에 관한 볍률)을 비롯하여 과학기술정보통신부가 제정한 [개인정보 보호 지침] 등
                개인정보 보호 관련 각정 법규를 준수하고 있습니다.
            </p>

            <p class="mt-4 font-semibold">본 병의원은 서비스 이용을 위하여 필요한 최소한의 개인정보만을 수집합니다.</p>
            <p class="mt-2">필수항목: 성명, 주민등록번호, 연락처</p>

            <p class="mt-4 font-semibold">개인정보 항목별 구체적인 수집 목적 및 이용 목적은 다음과 같습니다.</p>
            <p class="mt-2">필수항목: 서비스 이용에 따른 국민건강보험 자격조회 및 본인 식별에 이용</p>
        </div>

        <!-- 체크박스 -->
        <div class="mt-6">
            <label class="block flex items-center">
                <input type="checkbox" v-model="agreed" @change="toggleAgreement"
                    class="mr-2 w-5 h-5 accent-blue-500" />
                <span class="text-gray-900 font-medium">본인은 병의원에서 안내되는 [개인정보 수집 및 이용에 따른 안내]를 확인하였으며, 위 내용에 대해
                    동의합니다.</span>
            </label>
        </div>

        <!-- 보호자 관련 내용 -->
        <div class="mt-6 text-gray-700 text-sm">
            <p class="font-semibold">보호자의 경우, 아래 내용을 확인해주세요</p>
            <ul class="list-none mt-2 space-y-1">
                <li>* 보호자가 서명하게 된 사유</li>
                <li>- 환자의 신체, 정신적 장애로 인하여 약관 내용을 이해하지 못함</li>
                <li>- 환자 본인이 승낙에 관한 권한을 특정인에게 위임함</li>
                <li>- 만 14세 미만의 아동인 경우(법정대리인의 동의 필요함)</li>
                <li>- 기타</li>
            </ul>
        </div>
    </div>
</template>
