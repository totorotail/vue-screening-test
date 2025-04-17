import apiClient from './api';

interface HospitalInfoResponse {
    email: string;
    hospitalName: string;
    location: string; // e.g., "GYEONGGI"
    plan: string;     // e.g., "STARTER"
}

interface RegistrationRequest {
    email: string;
    password: string;
    hospitalName: string;
    location: string;
}

interface LoginRequest {
    email: string;
    password: string;
}

interface InfoUpdateRequest {
    password: string;
    hospitalName: string;
    location: string;
}

interface PlanUpdateRequest {
    plan: string;
}

const HospitalService = {
    // 병원 정보 조회 (로그인된 사용자 기준)
    getMyInfo() {
        return apiClient.get<HospitalInfoResponse>('/hospital');
    },

    // 병원 회원가입
    register(data: RegistrationRequest) {
        return apiClient.post('/hospital/register', data);
    },

    // 병원 로그인
    login(data: LoginRequest) {
        return apiClient.post('/hospital/login', data);
    },

    // 병원 정보 업데이트
    updateInfo(data: InfoUpdateRequest) {
        return apiClient.put('/hospital/update', data);
    },

    // 요금제 업데이트
    updatePlan(data: PlanUpdateRequest) {
        return apiClient.put('/hospital/plan', data);
    }
};

export default HospitalService;