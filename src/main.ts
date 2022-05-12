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
import router from './router'
app.use(router)


// 全局通知
import Notification from './plugins/notification'
app.use(Notification)

// 全局弹窗
import Dialog from './plugins/dialog'
app.use(Dialog)

app.mount('#app')

app.config.errorHandler = (err)=>{
  console.log(err)
}

