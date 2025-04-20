import apiClient from './api';

interface PatientCreateRequest {
    name: string;
    residentRegistrationNumber: string;
    phoneNumber: string;
    patientNumber: string;
}

interface PatientUpdateRequest {
    name: string;
    residentRegistrationNumber: string;
    phoneNumber: string;
    patientNumber: string;
}

export interface PatientDuplicateCheckRequest {
    patientNumber: string;
    excludePatientId?: number; // 환자 수정 시 본인 ID를 제외
}

const PatientService = {
    // 환자 등록
    registerPatient(data: PatientCreateRequest) {
        return apiClient.post('/patient/register', data);
    },

    // 모든 환자 목록 조회 (페이징)
    getAllPatients(page = 0, size = 10) {
        return apiClient.get(`/patient?page=${page}&size=${size}`);
    },

    // 환자 이름으로 검색 (페이징)
    searchPatientsByName(name: string, page = 0, size = 10) {
        return apiClient.get(`/patient/search?name=${encodeURIComponent(name)}&page=${page}&size=${size}`);
    },

    // 특정 환자 정보 조회
    getPatientById(id: number) {
        return apiClient.get(`/patient/${id}`);
    },

    // 환자 정보 업데이트
    updatePatient(id: number, data: PatientUpdateRequest) {
        return apiClient.put(`/patient/${id}`, data);
    },

    // 환자번호 중복 여부 확인
    checkDuplicatePatientNumber(data: PatientDuplicateCheckRequest) {
        return apiClient.post('/patient/check-duplicate', data);
    }
};

export default PatientService;