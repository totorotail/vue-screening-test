// stores/testStore.ts
import { defineStore } from 'pinia';

export const useTestStore = defineStore('testStore', {
    state: () => ({
        testCategories: [
            { id: "AUDIT", name: "알코올 사용장애", color: "text-red-500", bg: "bg-red-100" },
            { id: "BAI", name: "벡 불안척도", color: "text-green-500", bg: "bg-green-100" },
            { id: "BDI", name: "벡 우울척도", color: "text-yellow-500", bg: "bg-yellow-100" },
            { id: "GDS", name: "노인우울척도", color: "text-orange-500", bg: "bg-orange-100" },
            { id: "PSQI", name: "피츠버그 수면의 질 척도", color: "text-lime-500", bg: "bg-lime-100" },
            { id: "STAI", name: "상태-특성 불안척도", color: "text-blue-500", bg: "bg-blue-100" },
            { id: "K-SADS", name: "사회불안척도", color: "text-pink-500", bg: "bg-pink-100" },
            { id: "ASRS", name: "성인자기보고척도", color: "text-purple-500", bg: "bg-purple-100" },
            { id: "PDSS", name: "공황장애 평가척도", color: "text-indigo-500", bg: "bg-indigo-100" },
            { id: "HAM-D", name: "헤밀턴 우울 검사", color: "text-blue-300", bg: "bg-blue-100" },
            { id: "HAM-A", name: "헤밀턴 불안 검사", color: "text-yellow-300", bg: "bg-yellow-100" },
            { id: "YMRS", name: "조증 평가척도", color: "text-red-300", bg: "bg-red-100" },
            { id: "BPRS", name: "간편 정신상태 평정 척도", color: "text-teal-500", bg: "bg-teal-100" },
            { id: "OCI-R-K", name: "강박장애 척도", color: "text-purple-300", bg: "bg-purple-100" },
            { id: "MMSEK", name: "간이 정신상태 검사", color: "text-gray-500", bg: "bg-gray-100" },
            { id: "ESS", name: "앱워스 주간졸림 설문", color: "text-pink-300", bg: "bg-pink-100" },
            { id: "K-ASRS", name: "성인용 ADHD 자기보고 척도", color: "text-blue-400", bg: "bg-blue-100" },
            { id: "K-RRS", name: "반추적 반응양식 척도", color: "text-orange-300", bg: "bg-orange-100" }
        ]
    })
});
