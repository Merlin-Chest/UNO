<template>
  <div flex justify-around items-center ref="area" h="30">
    <div flex flex-col justify-evenly h="100%">
      <button c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
        hover="bg-gray text-white" px-3 py-1 @click="handleLeave">离开房间</button>
    </div>
    <Card transition="duration-400" v-for="(card, i) in cards"
      :style="{ marginLeft: i > 0 ? `-${interval}px` : 0, zIndex: i }" :key="card.type + card.color" :type="card.type"
      :color="card.color" :icon="card.icon" @select-card="selectCard(i)" @un-select-card="unSelectCard(i)">
    </Card>
    <div flex flex-col justify-evenly h="100%">
      <button v-show="isInTurn" c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent"
        transition="duration-400" hover="bg-gray text-white" px-3 py-1 @click="handleDealCards">出牌</button>
      <button v-show="isInTurn" c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent"
        transition="duration-400" hover="bg-gray text-white" px-3 py-1 @click="handleGetCard">取牌</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import { isInTurn, useCheckCard, useNotify } from '~/composables';
import useSocketStore from '~/store/socket';
import useUserStore from '~/store/user';
import Dialog from '~/plugins/dialog/Dialog';
const emit = defineEmits(['dealCard'])
const socketStore = useSocketStore()
const roomStore = useRoomStore();
const userStore = useUserStore()
const cards = computed(() => roomStore.userCards)
const router = useRouter()
const selectList = ref<Set<number>>(new Set());

const selectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  selectList.value.add(i);
}

const handleLeave = () => {
  socketStore.leaveGame(roomStore.roomCode, userStore.getUserInfo()).then((res) => {
    const { message } = res;
    useNotify(message);
    roomStore.cleanRoom(router);
  })
}

const handleDealCards = () => {
  if (selectList.value.size === 0) {
    useNotify('请选择要出的牌');
    return;
  }
  emit('dealCard', selectList.value);
  selectList.value = new Set();
}

const handleGetCard = ()=>{
  socketStore.getOneCard(roomStore.roomCode).then((res)=>{
    const {data,message} = res;
    useNotify(message);
    if(data){
      const {card,userCards} = data;
      roomStore.setUserCards(userCards);
      if(useCheckCard(card)){
        Dialog({
          title: '获得的牌符合规则',
          content:'是否打出此牌？',
        })
      }else{
        socketStore.toNextTurn(roomStore.roomCode)
      }
    }
  })
}

const unSelectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  selectList.value.delete(i)
}

let area = $ref<HTMLElement>();

const interval = computed(() => {
  if (!cards.value?.length || cards.value.length === 0 || !area) return 0;
  const cardWidth = area.children[0].clientWidth;
  const res = (area.offsetWidth - cardWidth) / (cards.value.length - 1)
  return res;
})

</script>

<style scoped>
</style>
