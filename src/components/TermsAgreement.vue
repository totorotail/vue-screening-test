<script setup lang="ts">
defineProps<{
    agreed: boolean;
}>();

const emit = defineEmits(['update:agreed']);

const toggleAgreement = (event: Event) => {
    const checked = (event.target as HTMLInputElement).checked;
    emit('update:agreed', checked);
};
</script>

<template>
    <div class="max-w-[500px] mx-auto">
        <!-- 타이틀 -->
        <h2 class="text-lg font-bold mb-3">개인정보 수집 및 이용에 대한 동의서</h2>

        <!-- 본문 -->
        <div class="text-gray-700">
            <p class="text-base font-bold mb-2">개인정보 수집 및 이용에 대한 안내</p>
            <p class="text-sm mb-4">
                본 병의원은 고객의 개인정보를 매우 소중하게 생각하며, 고객의 개인정보를 가장 효과적이고 안전하게 보호하기 위하여 최선의 노력을 다하고 있습니다.
                본 병의원은 개인정보보호 관련 주요 법률(정보통신망 이용촉진 및 정보보호 등에 관한 법률)을 비롯하여 과학기술정보통신부가 제정한 [개인정보 보호 지침] 등 개인정보 보호 관련 각종 법규를
                준수하고 있습니다.
            </p>

            <p class="text-base font-bold mb-2">본 병의원은 서비스 이용을 위하여 필요한 최소한의 개인정보만을 수집합니다.</p>
            <p class="text-sm mb-4">필수항목: 성명, 주민등록번호, 연락처</p>

            <p class="text-base font-bold mb-2">개인정보 항목별 구체적인 수집 목적 및 이용목적은 다음과 같습니다.</p>
            <p class="text-sm mb-4">필수항목: 서비스 이용에 따른 국민건강보험 자격조회 및 본인 식별에 이용</p>
        </div>

        <!-- 체크박스 -->
        <div class="flex items-center mb-5">
            <input type="checkbox" id="agreeTerms" :checked="agreed" @change="toggleAgreement"
                class="mr-2 h-4 w-4 accent-blue-500">
            <label for="agreeTerms" class="text-sm font-bold">
                본인은 병의원에서 안내하는 [개인정보 수집 및 이용에 따른 안내]를 확인하였으며, 위 내용에 대해 동의합니다.
            </label>
        </div>

        <!-- 보호자 관련 내용 -->
        <div class="text-sm text-gray-600">
            <p class="font-bold mb-2">보호자의 경우, 아래 내용을 확인해주세요</p>
            <ul class="list-none pl-0 space-y-1">
                <li>* 보호자가 서명하게 된 사유</li>
                <li>- 환자의 신체, 정신적 장애로 인하여 약관 내용을 이해하지 못함</li>
                <li>- 환자 본인이 승낙에 관한 권한을 특정인에게 위임함</li>
                <li>- 만 14세 미만의 아동인 경우(법정대리인의 동의 필요함)</li>
                <li>- 기타</li>
            </ul>
        </div>
    </div>
</template>