import { defineStore } from 'pinia';

interface Patient {
  id: number;
  name: string;
  patientNumber: string;
  birthDate: string;
  idNumber: string; // 주민등록번호
  phone: string;
  lastExam: string | null;
}

interface User {
  email: string;
  password: string;
  hospitalName: string;
  location: string;
  plan: string;
  patients: Patient[]; // ✅ 환자 목록 추가
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
          password,
          hospitalName: '참조은뇌과병원',
          location: '경상도',
          plan: 'BASIC',
          patients: [] // ✅ 초기 환자 리스트 빈 배열
        };
        this.errorMessage = '';
        return true;
      } else {
        this.errorMessage = '이메일 또는 비밀번호가 잘못되었습니다.';
        return false;
      }
    },

    register(email: string, password: string, hospitalName: string, location: string) {
      this.user = {
        email,
        password,
        hospitalName,
        location,
        plan: 'STARTER',
        patients: [] // ✅ 신규 가입자도 빈 환자 리스트 포함
      };
    },

    // ✅ 환자번호 중복 검사 함수 추가
    isPatientIdDuplicate(patientNumber: string): boolean {
      if (!this.user) return false;
      return this.user.patients.some(patient => patient.patientNumber === patientNumber);
    },

    // ✅ 환자 등록 함수 추가
    registerPatient(patientData: Omit<Patient, 'id'>) {
      if (this.user) {
        const newId = this.user.patients.length + 1; // ✅ 자동 증가 ID
        this.user.patients.push({ id: newId, ...patientData });
      }
    },
  },
});
