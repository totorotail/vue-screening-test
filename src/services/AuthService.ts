import apiClient from './api';
import HospitalService from './HospitalService';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string; // 이메일(username)
  exp: number; // 만료 시간
  iat: number; // 발급 시간
}

/**
 * 인증 관련 기능을 처리하는 서비스
 */
const AuthService = {
  /**
   * 로그인 처리 및 토큰 저장
   * @param credentials 로그인 정보
   * @returns 로그인 결과 데이터
   */
  async login(credentials: { email: string; password: string }) {
    const response = await HospitalService.login(credentials);
    const { token } = response.data;
    this.setToken(token);
    return response.data;
  },

  /**
   * 토큰 설정 및 헤더에 추가
   * @param token JWT 토큰
   */
  setToken(token: string) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },

  /**
   * 토큰 삭제 및 헤더에서 제거
   */
  clearToken() {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  /**
   * 저장된 토큰 반환
   * @returns 저장된 JWT 토큰
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * 토큰 유효성 검사
   * @returns 토큰이 유효한지 여부
   */
  isTokenValid() {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      // 현재 시간(초)이 토큰 만료 시간보다 작은지 확인
      return decoded.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  },

  /**
   * 토큰에서 사용자 이메일 추출
   * @returns 사용자 이메일 또는 null
   */
  getUserEmail() {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.sub;
    } catch (error) {
      return null;
    }
  },

  /**
   * 앱 시작 시 인증 상태 초기화
   */
  initAuth() {
    const token = this.getToken();
    if (token && this.isTokenValid()) {
      this.setToken(token);
    } else if (token && !this.isTokenValid()) {
      this.clearToken();
    }
  },

  /**
   * 로그아웃 처리
   */
  logout() {
    this.clearToken();
    // 추가적인 로그아웃 처리 (예: 리다이렉트)
  }
};

export default AuthService;