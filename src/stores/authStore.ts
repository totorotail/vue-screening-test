import { defineStore } from 'pinia';

interface User {
  email: string;
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
    login(email: string, password: string): boolean {
      if (email === 'admin@example.com' && password === 'Admin123!') {
        this.user = {
          email,
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
    register(email: string, hospitalName: string, location: string) {
      this.user = {
        email,
        hospitalName,
        location,
        plan: 'STARTER' // 신규 가입자는 STARTER 플랜
      };
    },
    logout() {
      this.user = null;
    },
  },
});
