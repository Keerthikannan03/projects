import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.js";

createApp(App)
.use(vuetify)
.mount('#app')
