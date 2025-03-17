import { defineStore } from "pinia";

interface ExamResult {
  totalScore: number;
  responses: number[];
}

interface Patient {
  id: number;
  name: string;
  patientNumber: string;
  birthDate: string;
  idNumber: string;
  phone: string;
  lastExam: string | null;
  examRecords: Record<string, Record<string, ExamResult>>; // ✅ 날짜별 검사 결과 저장
}

interface User {
  email: string;
  password: string;
  hospitalName: string;
  location: string;
  plan: string;
  patients: Patient[];
}

interface AuthState {
  user: User | null;
  errorMessage: string;
}

// ✅ 점수 자동 계산 함수
const calculateTotalScore = (responses: number[]): number => {
  return responses.reduce((sum, value) => sum + value, 0);
};

// ✅ 최신 검사 날짜를 찾는 함수
const getLatestExamDate = (examRecords: Record<string, Record<string, ExamResult>>): string | null => {
  const dates = Object.keys(examRecords);
  if (dates.length === 0) return null;
  return dates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]; // 최신 날짜 반환
};

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    errorMessage: "",
  }),

  actions: {
    login(email: string, password: string): boolean {
      if (email === "admin@example.com" && password === "Admin123!") {
        const examRecords = {
          "2024-11-20": {
            "AUDIT": { responses: [2, 3, 2, 1, 3], totalScore: calculateTotalScore([2, 3, 2, 1, 3]) },
            "BAI": { responses: [3, 3, 2, 3, 3], totalScore: calculateTotalScore([3, 3, 2, 3, 3]) },
            "PDSS": { responses: [2, 2, 3, 2, 2], totalScore: calculateTotalScore([2, 2, 3, 2, 2]) }
          },
          "2024-12-02": {
            "AUDIT": { responses: [2, 3, 2, 1, 3], totalScore: calculateTotalScore([2, 3, 2, 1, 3]) },
            "BAI": { responses: [2, 1, 3, 2, 2], totalScore: calculateTotalScore([2, 1, 3, 2, 2]) },
            "ESS": { responses: [1, 1, 1, 2, 1], totalScore: calculateTotalScore([1, 1, 1, 2, 1]) }
          }
        };

        this.user = {
          email,
          password,
          hospitalName: "참조은뇌과병원",
          location: "경상도",
          plan: "BASIC",
          patients: [
            {
              id: 1,
              name: "김아무개",
              patientNumber: "ABC01234",
              birthDate: "1990-10-10",
              idNumber: "901010-1012345",
              phone: "010-0123-4567",
              examRecords, // ✅ 중복 제거하여 한 번만 사용
              lastExam: getLatestExamDate(examRecords) // ✅ 최신 검사 날짜 자동 설정
            }
          ]
        };

        this.errorMessage = "";
        return true;
      } else {
        this.errorMessage = "이메일 또는 비밀번호가 잘못되었습니다.";
        return false;
      }
    },

    register(email: string, password: string, hospitalName: string, location: string) {
      this.user = {
        email,
        password,
        hospitalName,
        location,
        plan: "STARTER",
        patients: []
      };
    },

    isPatientIdDuplicate(patientNumber: string): boolean {
      if (!this.user) return false;
      return this.user.patients.some(patient => patient.patientNumber === patientNumber);
    },

    registerPatient(patientData: Omit<Patient, "id">) {
      if (this.user) {
        const newId = this.user.patients.length + 1;
        const newPatient: Patient = { id: newId, ...patientData, examRecords: {}, lastExam: null };
        this.user.patients.push(newPatient);
      }
    },

    // ✅ 검사 기록 추가 함수 (점수 자동 계산 & lastExam 자동 업데이트)
    addExamRecord(patientNumber: string, date: string, examType: string, responses: number[]) {
      if (!this.user) return;
      const patient = this.user.patients.find(p => p.patientNumber === patientNumber);
      if (!patient) return;

      if (!patient.examRecords[date]) {
        patient.examRecords[date] = {};
      }

      patient.examRecords[date][examType] = {
        responses,
        totalScore: calculateTotalScore(responses)
      };

      // ✅ 최신 검사 날짜 자동 업데이트
      patient.lastExam = getLatestExamDate(patient.examRecords);
    }
  }
});
