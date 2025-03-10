import { defineStore } from 'pinia';

export const useTestStore = defineStore('testStore', {
    state: () => ({
        testCategories: [
            { id: "AUDIT", name: "알코올 사용장애", color: "text-red-500 bg-red-100" },
            { id: "BAI", name: "벡 불안척도", color: "text-green-500 bg-green-100" },
            { id: "BDI", name: "벡 우울척도", color: "text-yellow-500 bg-yellow-100" },
            { id: "GDS", name: "노인우울척도", color: "text-orange-500 bg-orange-100" },
            { id: "PSQI", name: "피츠버그 수면의 질 척도", color: "text-green-600 bg-green-100" },
            { id: "STAI", name: "상태-특성 불안척도", color: "text-blue-500 bg-blue-100" },
            { id: "K-SADS", name: "사회불안척도", color: "text-pink-500 bg-pink-100" },
            { id: "ASRS", name: "성인자가보고척도", color: "text-purple-500 bg-purple-100" },
            { id: "PDSS", name: "공황장애 평가척도", color: "text-purple-600 bg-purple-100" },
            { id: "HAM-D", name: "해밀턴 우울 검사", color: "text-indigo-500 bg-indigo-100" },
            { id: "HAM-A", name: "해밀턴 불안 검사", color: "text-gray-500 bg-gray-100" },
            { id: "YMRS", name: "조증 평가척도", color: "text-red-400 bg-red-100" },
            { id: "BPRS", name: "간편 정신상태 평정 척도", color: "text-teal-500 bg-teal-100" },
            { id: "OCI-R-K", name: "강박장애 척도", color: "text-purple-700 bg-purple-100" },
            { id: "MMSEK", name: "간이 정신상태 검사", color: "text-gray-600 bg-gray-100" },
            { id: "ESS", name: "앱워스 주간졸림 설문", color: "text-pink-600 bg-pink-100" },
            { id: "K-ASRS", name: "성인용 ADHD 자가보고 척도", color: "text-blue-400 bg-blue-100" },
            { id: "K-RRS", name: "반추적 반응양식 척도", color: "text-orange-600 bg-orange-100" }
        ]
    }),
    getters: {
        getTestCategories: (state) => state.testCategories
    }
});
