import { defineStore } from 'pinia';

interface Patient {
  name: string;
  idNumber: string;
  phone: string;
  patientId: string;
}

interface User {
  email: string;
  password: string;
  hospitalName: string;
  location: string;
  plan: string;
  patients: Patient[]; // ✅ 각 유저가 등록한 환자 리스트 추가
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
    // 🔹 로그인 기능
    login(email: string, password: string): boolean {
      if (email === 'admin@example.com' && password === 'Admin123!') {
        this.user = {
          email,
          password,
          hospitalName: '참조은뇌과병원',
          location: '경상도',
          plan: 'BASIC',
          patients: [] // ✅ 로그인 시 환자 리스트 초기화
        };
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
        return false;
      }
    },

    // 🔹 회원가입 기능
    register(email: string, password: string, hospitalName: string, location: string) {
      this.user = {
        email,
        password,
        hospitalName,
        location,
        plan: 'STARTER',
        patients: [] // ✅ 회원가입 시 환자 리스트 추가
      };
    },

    // 🔹 환자 등록 기능 (현재 로그인한 유저의 환자 리스트에 추가)
    registerPatient(patient: Patient) {
      if (this.user) {
        this.user.patients.push(patient);
      }
    },

    // 🔹 환자번호 중복 확인 (회원별 환자 리스트에서 검사)
    isPatientIdDuplicate(patientId: string): boolean {
      return this.user?.patients.some(patient => patient.patientId === patientId) ?? false;
    },

    // 🔹 로그아웃 기능
    logout() {
      this.user = null;
    },
  },
});
