import { createApp } from 'vue'
import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'

// import router from './router'
import App from './App.vue'

// css 样式
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import '~/styles/iconfont/iconfont.css'

import './socket'

const app = createApp(App)

// 状态管理
import { store } from './store'
app.use(store)

// 路由管理
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')

app.config.errorHandler = (err)=>{
  console.log(err)
}

