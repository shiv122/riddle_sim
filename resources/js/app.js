import './bootstrap';
import { createApp } from 'vue'
import '../css/app.css'
import App from '../vue/App.vue'
import "vue-toastification/dist/index.css";
import Toast, { POSITION } from "vue-toastification";
let app = createApp(App)
const options = {
    position: POSITION.BOTTOM_RIGHT,
};
app.use(Toast, options);
app.mount("#app")

