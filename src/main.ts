import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import routes from 'virtual:generated-pages'
import App from './App.vue'

// css 样式
import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'
import '~/styles/iconfont/iconfont.css'

export const app = createApp(App)

// websocket相关
import { useSocketStoreWithOut } from '~/store/socket';
import VueNativeSock from "vue-native-websocket-vue3";
const socketStore = useSocketStoreWithOut();
app.use(VueNativeSock, "", {
  store: socketStore
});

// 路由管理
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})
app.use(router)
app.mount('#app')

