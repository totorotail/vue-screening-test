import apiClient from './api';

interface TestAnswerDto {
    questionId: number;
    selectedOptionId?: number; // 객관식인 경우 (선택적)
    textAnswer?: string;       // 주관식인 경우 (선택적)
    score?: number;            // 백엔드에서 계산됨 (선택적)
}

interface TestResultDto {
    patientId: number;
    testAcronym: string;       // AUDIT, BAI 등
    testDate: string;          // 'YYYY-MM-DD' 형식
    totalScore?: number;       // 백엔드에서 계산될 수 있음 (선택적)
    answers: TestAnswerDto[];
    comment?: string;          // 의사 또는 간호사의 코멘트 (선택적)
}

const TestService = {
    // 특정 검사의 기본 정보를 조회
    getTestInfo(acronym: string) {
        return apiClient.get(`/test/info/${acronym}`)
            .then(response => {
                // 안전한 JSON 처리 시도
                try {
                    if (typeof response.data.questionsConfig === 'string') {
                        const parsed = JSON.parse(response.data.questionsConfig);
                        response.data.parsedConfig = parsed; // 새 속성에 파싱된 객체 저장
                    }
                } catch (e) {
                    console.warn(`JSON 파싱 경고: ${acronym}`, e);
                }
                return response;
            });
    },

    // 모든 검사 목록을 조회
    getAllTests() {
        return apiClient.get('/test/info');
    },

    // 환자의 검사 결과를 저장
    saveTestResult(data: TestResultDto) {
        return apiClient.post('/test', data);
    },

    // 특정 환자의 모든 검사 이력을 조회
    getPatientTestHistory(patientId: number) {
        return apiClient.get(`/test/${patientId}`);
    },

    // 특정 환자의 특정 날짜에 수행한 특정 검사 결과를 조회
    getTestResult(patientId: number, testAcronym: string, testDate: string) {
        return apiClient.get(`/test/${patientId}/${testAcronym}/${testDate}`);
    },

    // 특정 환자의 특정 검사에 대한 시간별 점수 이력을 조회 (그래프 데이터용)
    getPatientTestScoreHistory(patientId: number, testAcronym: string) {
        return apiClient.get(`/test/${patientId}/score-history/${testAcronym}`);
    },

    // 특정 환자의 검사 이력 요약 정보를 조회 (날짜별 검사 목록)
    getPatientTestHistorySummary(patientId: number) {
        return apiClient.get(`/test/${patientId}/history-summary`);
    },

    // 특정 환자의 특정 날짜에 수행한 특정 검사의 상세 정보와 결과를 함께 조회
    getTestDetailWithResult(patientId: number, testAcronym: string, testDate: string) {
        return apiClient.get(`/test/${patientId}/${testAcronym}/${testDate}/detail`);
    }
};

export default TestService;