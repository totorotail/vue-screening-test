import { defineStore } from 'pinia';

interface User {
  email: string;
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
        this.user = { email };
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
        return false;
      }
    },
    logout() {
      this.user = null;
    },
  },
});

