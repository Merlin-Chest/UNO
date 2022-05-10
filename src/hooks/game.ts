import { useRoomStore } from "~/store/room"
import {store as pinia} from'~/store'
import useUserStore from "~/store/user"

const roomStore = useRoomStore(pinia)
const userStore = useUserStore(pinia)

// 判断是否轮到自己
export const isOrder = computed(() => {
  const idx = roomStore.players.findIndex(p => p.id === userStore.id && p.name === userStore.name)
  return idx === roomStore.order
})
