<template>
  <div flex justify-around items-center h="26">
    <div w="10%" flex flex-col justify-evenly h="100%">
      <button c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
        hover="bg-gray text-white" px-3 py-1 @click="handleLeave">离开房间</button>
    </div>
    <div flex box-border items-center justify="start" overflow="y-visible" w="70%" ref="cardArea">
      <Card transition="duration-400" v-for="(card, i) in cards" 
      :z="i" flex="none" relative :style="{left:interval*(cards.length > 5 ? i : 1)+'px'}" translate="hover:y--8" 
      :key="card.type + card.color" :type="card.type" :color="card.color" :icon="card.icon" :order="i">
        </Card>
    </div>
    <div w="10%" flex flex-col justify-evenly h="100%">
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
const selectList = computed(() => roomStore.selectCards)

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
  if (selectList.value.size > 1) {
    useNotify('请选择一张牌');
    return;
  }
  emit('dealCard', Array.from(selectList.value));
  roomStore.clearSelectCards()
}

const handleGetCard = () => {
  socketStore.getOneCard(roomStore.roomCode).then((res) => {
    const { data, message } = res;
    useNotify(message);
    if (data) {
      const { card, userCards } = data;
      roomStore.setUserCards(userCards);
      if (useCheckCard(card)) {
        Dialog({
          title: '获得的牌符合规则',
          content: '是否打出此牌？',
          comfirm: (close) => {
            const idx = roomStore.userCards.findIndex(c => c.type === card.type && c.color === card.color)
            socketStore.outOfCard([idx], roomStore.roomCode).then((res) => {
              const { message, data } = res
              if (data) {
                roomStore.setUserCards(data)
              }
              close()
              useNotify(message);
            })
          },
          cancel: (close) => {
            socketStore.toNextTurn(roomStore.roomCode);
            close()
          }
        })
      } else {
        socketStore.toNextTurn(roomStore.roomCode)
      }
    }
  })
}



let cardArea = $ref<HTMLElement>();

const interval = computed(() => {
  if (!cards.value?.length || cards.value.length === 0 || !cardArea) return 0;
  const cardWidth = cardArea.children[0].clientWidth;
  const cardAreaWidth = cardArea.clientWidth;
  console.log('cardWidth:', cardWidth)
  console.log('cardAreaWidth:', cardAreaWidth)
  if(cards.value.length < 5) return (cardAreaWidth - cardWidth * cards.value.length) /  2;
  return -1 * (cardWidth * cards.value.length - cardAreaWidth) / (cards.value.length - 1);
})

</script>

<style scoped>
</style>
