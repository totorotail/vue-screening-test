import { defineStore } from 'pinia';

interface User {
  email: string;
  password: string;  // 🔹 비밀번호 필드 추가
  hospitalName: string;
  location: string;
  plan: string;
}

interface AuthState {
  user: User | null;
  errorMessage: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    errorMessage: '',
  }),
  actions: {
    // 🔹 로그인 (비밀번호 저장)
    login(email: string, password: string): boolean {
      if (email === 'admin@example.com' && password === 'Admin123!') {
        this.user = {
          email,
          password,  // 🔹 비밀번호 저장 (개발용)
          hospitalName: '참조은뇌과병원',
          location: '경상도',
          plan: 'BASIC'
        };
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
        return false;
      }
    },

    // 🔹 회원가입 (비밀번호 저장)
    register(email: string, password: string, hospitalName: string, location: string) {
      this.user = {
        email,
        password,  // 🔹 비밀번호 저장 (개발용)
        hospitalName,
        location,
        plan: 'STARTER' // 신규 가입자는 STARTER 플랜
      };
    },

    // 🔹 비밀번호 검증 함수 (비밀번호 확인 시 사용)
    verifyPassword(inputPassword: string): boolean {
      return this.user?.password === inputPassword;
    },

    // 🔹 로그아웃 (비밀번호도 삭제)
    logout() {
      this.user = null;
    },
  },
});
