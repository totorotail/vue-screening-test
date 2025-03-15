import { createApp } from 'vue'
import { createPinia } from 'pinia';
import './style.css'
import App from './App.vue'
import router from './router/router.ts';
import VueGoogleCharts from 'vue-google-charts';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUserPlus, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

library.add(faUserPlus, faMagnifyingGlass);

createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .use(VueGoogleCharts)
    .use(createPinia())
    .use(router)
    .mount('#app')
