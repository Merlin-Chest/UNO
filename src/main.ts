import { createApp } from 'vue'
import App from './App.vue'

// css 样式
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import '~/styles/iconfont/iconfont.css'

// 注册websocket
import './socket'

const app = createApp(App)

// 状态管理
import { store } from './store'
app.use(store)

// 路由管理
import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 全局通知
import Notification from './plugins/notification'
app.use(Notification)

app.use(router)
app.mount('#app')

app.config.errorHandler = (err)=>{
  console.log(err)
}

