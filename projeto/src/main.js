import './assets/main.css';
import { createApp, reactive } from 'vue'; 
import router from './router';
import App from './App.vue';

const globalState = reactive({
  posto: '-1',
  mecanicoID: '-1'
});

const app = createApp(App);

app.config.globalProperties.$globalState = globalState; 

app.use(router);
app.mount('#app');





