import { defineStore } from 'pinia';

export const useTestDetailsStore = defineStore('testDetailsStore', {
    state: () => ({
        testDetails: {
            "AUDIT": {
                description: '알코올 사용장애를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '최근 한 달 동안 음주 횟수는 얼마나 되십니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '한 번의 음주량이 얼마나 됩니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '술을 마신 후 후회한 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '아침에 해장술을 마신 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '술로 인해 가족이나 친구와 문제가 생긴 적이 있습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "BAI": {
                description: '불안 수준을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '가끔씩 몸이 저리고 쑤시는 감각이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '흥분된 느낌을 받습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '가끔식 다리가 떨립니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '편안하게 쉴 수 없습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '심장이 두근거리는 느낌이 있습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "BDI": {
                description: '우울감을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '슬픈 기분을 자주 느낍니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '최근 관심을 잃은 활동이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '자주 피곤함을 느낍니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '잠을 잘 못 이루십니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '자신감이 부족하다고 생각하십니까?', options: [0, 1, 2, 3] },
                ],
            },
            "GDS": {
                description: '노인의 우울 정도를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자주 외롭다고 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '삶이 무의미하게 느껴질 때가 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '사람들과 어울리는 것이 어려운가요?', options: [0, 1, 2, 3] },
                    { id: 4, text: '기력이 없다고 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '슬픈 감정을 자주 느끼십니까?', options: [0, 1, 2, 3] },
                ],
            },
            "PSQI": {
                description: '수면의 질을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '잠자리에 드는 시간이 일정합니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '밤에 자주 깹니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '잠을 자도 개운하지 않습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '낮에 졸음을 자주 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '밤에 악몽을 꾸는 편입니까?', options: [0, 1, 2, 3] },
                ],
            },
            "STAI": {
                description: '불안 수준을 측정하는 검사입니다.',
                questions: [
                    { id: 1, text: '긴장을 자주 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '예민한 상태가 지속됩니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '작은 일에도 불안함을 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '압박감을 자주 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '자주 손발이 차가워집니까?', options: [0, 1, 2, 3] },
                ],
            },
            "K-SADS": {
                description: '사회불안 수준을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '사람들 앞에서 이야기할 때 불편함을 느낍니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '낯선 사람과 대화하는 것이 어렵습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '사회적인 상황에서 쉽게 긴장됩니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '사람들 앞에서 행동하는 것이 두렵습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '다른 사람의 평가를 받을 때 불안을 느낍니까?', options: [0, 1, 2, 3] },
                ],
            },
            "ASRS": {
                description: '성인 ADHD(주의력 결핍 및 과잉행동장애)를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자주 집중하는 것이 어렵습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '해야 할 일을 잊어버리는 경우가 많습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '과도한 활동을 자주 합니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '조용히 있어야 할 때도 움직이고 싶습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '감정을 조절하기 어려운가요?', options: [0, 1, 2, 3] },
                ],
            },
            "PDSS": {
                description: '공황장애 증상을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '갑작스러운 심장 두근거림을 경험하십니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '숨이 막히는 느낌이 듭니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '몸이 갑자기 뜨거워지거나 차가워지는 경험이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '갑자기 어지럽거나 쓰러질 것 같은 느낌이 듭니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '공황 발작이 반복적으로 발생합니까?', options: [0, 1, 2, 3] },
                ],
            },
            "HAM-D": {
                description: '우울증의 정도를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자주 슬픈 기분을 느낍니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '불면증을 경험한 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '식욕이 감소하거나 증가했습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '자주 피로감을 느끼십니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '자신을 비하하는 생각이 자주 듭니까?', options: [0, 1, 2, 3] },
                ],
            },
            "HAM-A": {
                description: '불안 상태를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '사소한 일에도 걱정이 많습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '긴장된 상태가 자주 지속됩니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '자주 소화불량을 겪습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '밤에 잠을 설치는 일이 많습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '불안이 심할 때 가슴이 답답한 느낌이 듭니까?', options: [0, 1, 2, 3] },
                ],
            },
            "YMRS": {
                description: '조증(과잉행동 상태)을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자신감이 지나치게 높아진 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '잠을 적게 자도 피곤하지 않습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '말이 많아지거나 속도가 빨라졌습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '일을 너무 많이 벌려서 감당이 어렵습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '감정이 급격하게 변합니까?', options: [0, 1, 2, 3] },
                ],
            },
            "BPRS": {
                description: '간편 정신상태 평정 척도(BPRS)는 정신병적 증상의 심각도를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '최근 다른 사람이 나를 해치려 한다는 생각이 들었습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '환청(다른 사람이 들을 수 없는 소리)이 들린 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '기분이 급격하게 변하는 것을 경험하였습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '무언가를 계속 반복해서 생각하는 경향이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '현실과 동떨어진 생각을 한다고 느낀 적이 있습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "OCI-R-K": {
                description: '강박장애 척도(OCI-R-K)는 강박적 사고 및 행동 패턴을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '손을 씻어도 불안해서 계속 씻고 싶습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '물건이 정리되어 있지 않으면 불안합니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '같은 행동을 반복적으로 하지 않으면 불안합니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '특정 숫자나 패턴을 따라야 안심이 됩니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '나쁜 일이 일어날 것 같아 특정 행동을 반복한 적이 있습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "MMSEK": {
                description: '간이 정신상태 검사(MMSEK)는 인지기능을 평가하여 치매 여부를 판단하는 데 사용됩니다.',
                questions: [
                    { id: 1, text: '오늘이 무슨 요일인지 알고 있습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '간단한 계산(예: 100에서 7씩 빼기)을 할 수 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '최근의 중요한 사건을 기억할 수 있습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '주변 사람들의 얼굴과 이름을 기억할 수 있습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '3개의 단어를 듣고 몇 분 후 기억할 수 있습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "ESS": {
                description: '앱워스 주간졸림 척도(ESS)는 주간 졸음의 정도를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '앉아서 책을 읽을 때 쉽게 졸립습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: 'TV를 시청할 때 졸음을 느낀 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '공공장소에서 가만히 앉아 있을 때 졸린 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '차를 타고 1시간 이상 이동할 때 졸린 적이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '정오에 누워 쉴 때 쉽게 잠이 듭니까?', options: [0, 1, 2, 3] },
                ],
            },
            "K-ASRS": {
                description: '성인 ADHD 자기보고 척도(K-ASRS)는 성인 ADHD의 증상을 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자주 계획을 세우고도 실행하지 못합니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '자주 물건을 잃어버리거나 깜빡합니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '순서대로 일을 진행하는 것이 어렵습니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '사소한 일에도 쉽게 주의가 분산됩니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '긴 시간 동안 앉아 있어야 하는 일이 어렵습니까?', options: [0, 1, 2, 3] },
                ],
            },
            "K-RRS": {
                description: '반추적 반응양식 척도(K-RRS)는 부정적인 사고 패턴을 반복적으로 경험하는 정도를 평가하는 검사입니다.',
                questions: [
                    { id: 1, text: '자신의 감정을 지나치게 분석하는 경향이 있습니까?', options: [0, 1, 2, 3] },
                    { id: 2, text: '부정적인 경험을 자꾸 곱씹으며 생각합니까?', options: [0, 1, 2, 3] },
                    { id: 3, text: '과거의 실수를 자주 떠올리며 후회합니까?', options: [0, 1, 2, 3] },
                    { id: 4, text: '앞으로 일어날 걱정거리를 반복적으로 생각합니까?', options: [0, 1, 2, 3] },
                    { id: 5, text: '자신의 행동과 감정을 반복적으로 되새기며 분석합니까?', options: [0, 1, 2, 3] },
                ],
            },
        },
    }),
});
