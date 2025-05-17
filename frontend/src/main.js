import { createApp } from 'vue'
import './style.css'
import router from './router';
import { create, NButton, NInput, NForm, NFormItem, NCheckbox } from 'naive-ui';
import App from './App.vue'

const naive = create({
    components: [NButton, NInput, NForm, NFormItem, NCheckbox]
  });

const app = createApp(App);
app.use(router);
app.use(naive);
app.mount('#app');