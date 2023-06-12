import './assets/base.css'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import VeeValidate from './includes/validation'
import { registerSW } from 'virtual:pwa-register'

import App from './App.vue'
import router from './router'

registerSW({ immediate: true })

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VeeValidate)

app.mount('#app')
