import axios from 'axios';

// 현재 모드 확인
const mode = import.meta.env.MODE;

// 환경변수에서 API 기본 URL 가져오기
const configuredBaseURL = import.meta.env.VITE_API_BASE_URL;

// 개발 환경에서는 프록시 경로 사용
const baseURL = mode === 'development' ? '/api/v1' : configuredBaseURL;

const apiClient = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

export default apiClient;