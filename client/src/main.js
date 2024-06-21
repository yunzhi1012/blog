import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import naive, { createDiscreteApi } from 'naive-ui'
import { createPinia } from 'pinia'
import { router } from './common/router'
import axios from 'axios'
import { AdminStore } from './stores/AdminStore'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
axios.defaults.baseURL = "http://localhost:8080"

const { message, dialog, notification,select } = createDiscreteApi(["message", "dialog", "notification","select"])

const app = createApp(App)

app.provide("axios", axios)
app.provide("message", message)
app.provide("dialog", dialog)
app.provide("select", select)
app.provide("notification", notification)
app.provide("server_url", axios.defaults.baseURL)


app.use(naive)
app.use(router)
app.use(ElementPlus)
app.use(createPinia())

const adminStore = AdminStore()

axios.interceptors.request.use((config) => {
    config.headers.token = adminStore.token 
    return config
})


app.mount('#app')
