import mitt from 'mitt';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const emitter = mitt();
const app = createApp(App);

// register a global property to use in all modules available
// in Vue app
app.config.globalProperties.$emitter = emitter;
app.use(router).mount('#app');
