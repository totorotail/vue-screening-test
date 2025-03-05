import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../pages/LoginPage.vue';
import SignUpPage from '../pages/SignUpPage.vue';
import HospitalInfoPage from '../pages/HospitalInfoPage.vue';

const routes = [
    { path: '/', name: 'Login', component: LoginPage },
    { path: '/signup', name: 'SignUp', component: SignUpPage },
    { path: '/hospital-info', name: 'HospitalInfo', component: HospitalInfoPage },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
