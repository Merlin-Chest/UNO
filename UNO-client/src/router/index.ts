import routes from 'virtual:generated-pages'
import { createRouter, createWebHistory } from 'vue-router'
import { store } from '~/store'
import { useRoomStore } from '~/store/room'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to,from,next)=>{
  if((to.name === 'wait' && from.name != 'index')|| to.name === 'process' || to.name === 'end'){
    const roomStore = useRoomStore(store)
    if(!roomStore.roomCode){
      router.push('/')
      return;
    }
  }
  next()
})

export default router
