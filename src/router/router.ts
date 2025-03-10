import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';
import HospitalInfoPage from '../pages/HospitalInfoPage.vue';
import PatientRegistrationPage from '../pages/PatientRegistrationPage.vue';
import PatientListPage from '../pages/PatientListPage.vue';
import PatientDetailPage from '../pages/PatientDetailPage.vue';

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'SignUp', component: SignUpPage },
    { path: '/hospital-info', name: 'HospitalInfo', component: HospitalInfoPage },
    { path: '/patient-registration', name: 'PatientRegistration', component: PatientRegistrationPage },
    { path: '/patient-list', name: 'PatientList', component: PatientListPage },
    { path: '/patient-detail/:patientId', name: 'PatientDetail', component: PatientDetailPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
