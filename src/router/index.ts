import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
const routes:RouteRecordRaw[] = [
  {
    path:'/',
    component:()=>import('../pages/index.vue')

  },
  {
    path:'/wait',
    component:()=>import('../pages/game/wait.vue')
  },
  {
    path:'/process',
    component:()=>import('../pages/game/process.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
  })

export default router
