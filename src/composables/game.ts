import { useRoomStore } from "~/store/room"
import {store as pinia} from'~/store'
import useUserStore from "~/store/user"

const roomStore = useRoomStore(pinia)
const userStore = useUserStore(pinia)

// 判断是否轮到自己
export const isInTurn = computed(() => {
  const idx = roomStore?.players?.findIndex(p => p.id === userStore.id && p.name === userStore.name)
  return idx === roomStore.order
})

export function useCheckCard(target: CardInfo): boolean {
  const lastCard = roomStore.lastCard
  if(!lastCard || isUniversalCard(target)) return true;
  return isSameColor(target,lastCard) || isSameType(target,lastCard);
}

function isSameColor(target: CardInfo, lastCard: CardInfo) {
  return target.color === lastCard.color
}

function isSameType(target: CardInfo, lastCard: CardInfo) {
  return target.type === lastCard.type
}

function isUniversalCard(target:CardInfo){
  return target.type === 'palette' || target.type === 'add-4';
}
