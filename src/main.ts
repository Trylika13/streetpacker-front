import './assets/main.css'

import { createApp } from 'vue';
import { createPinia} from "pinia";
import App from './App.vue';
import  router  from './router/index';
import './assets/main.css';
// @ts-ignore
import { registerSW } from 'virtual:pwa-register';

const app = createApp(App)

registerSW({immediate:true})

app.use(router)
app.use(createPinia())
app.mount('#app')
