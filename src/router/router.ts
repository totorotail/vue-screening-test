import { createRouter, createWebHistory } from 'vue-router';
import type { RouteLocationNormalized } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';
import HospitalInfoPage from '../pages/HospitalInfoPage.vue';
import PatientRegistrationPage from '../pages/PatientRegistrationPage.vue';
import PatientListPage from '../pages/PatientListPage.vue';
import PatientDetailPage from '../pages/PatientDetailPage.vue';
import TestPage from '../pages/TestPage.vue';
import ReturnToAdminPage from '../pages/ReturnToAdminPage.vue';

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'SignUp', component: SignUpPage },
    { path: '/hospital-info', name: 'HospitalInfo', component: HospitalInfoPage },
    { path: '/patient-registration', name: 'PatientRegistration', component: PatientRegistrationPage },
    { path: '/patient-list', name: 'PatientList', component: PatientListPage },
    { path: '/patient-detail/:id', name: 'PatientDetail', component: PatientDetailPage },
    {
        path: '/test',
        name: 'TestPage',
        component: TestPage,
        props: (route: RouteLocationNormalized) => ({
            selectedTests: (route.query.tests as string || '').split(',').filter(Boolean)
        })
    },
    { path: '/return-to-admin', name: 'ReturnToAdmin', component: ReturnToAdminPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
