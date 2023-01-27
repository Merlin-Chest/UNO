<template>
  <div flex flex-col justify-evenly items-center h="60 sm:80">
    <div w="100%" h="40 sm:60" relative ref="cardArea">
      <Card transition="duration-100" v-for="(card, i) in cards" :z="i" flex="none" :card-id="card.cardId" :style="{
        position: 'absolute',
        top: '0',
        left: '50%',
        transform: `rotate(${card.rotate}deg) translate(-50%, ${isActive(i) ? '-30px' : '0'})`,
        transformOrigin: card.transformOrigin
      }" :key="card.cardId" :type="card.type" :color="card.color" :icon="card.icon" :order="i"
        @click="handleClickCard(card, i)">
      </Card>
    </div>
    <div flex justify-evenly w="100%">
      <button c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
        hover="bg-gray text-white" px-3 py-1 @click="handleLeave">离开房间</button>
      <button v-show="isInTurn" c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent"
        transition="duration-400" hover="bg-gray text-white" px-3 py-1 @click="handleDealCards">出牌</button>
      <button v-show="isInTurn" c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent"
        transition="duration-400" hover="bg-gray text-white" px-3 py-1 @click="handleGetCard">取牌</button>
      <button c-red-500 text="3.5" b="red-500 rounded-10 3 dashed hover:transparent" transition="duration-400"
        hover="bg-red-500 text-white" px-3 py-1 @click="handleUNO">UNO</button>
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
let cardArea = $ref<HTMLElement>();

const cards = computed(() => {
  const tangle = Math.atan(cardArea?.clientWidth / 2 / cardArea?.clientHeight) * 180 / Math.PI;
  let space = tangle / (roomStore.userCards.length - 1)
  if (space > 12) space = 12
  return roomStore.userCards.map((item, index) => {
    return {
      rotate: (index - Math.floor(roomStore.userCards.length / 2)) * space,
      transformOrigin: `0 ${cardArea?.clientWidth / 2}px`,
      ...item,
    }
  })
})
const router = useRouter()
const selectList = computed(() => roomStore.selectCards)

const handleLeave = () => {
  Dialog({
    title: '离开房间',
    content: '是否确认？',
    comfirm: () => {
      socketStore.leaveGame(roomStore.roomCode, userStore.getUserInfo()).then(() => {
        roomStore.cleanRoom(router);
      })
    }
  })
}

const isActive = computed(() => {
  return (i: number) => {
    return roomStore.selectCards.has(i);
  }
})

const handleClickCard = (card: CardInfo, i: number) => {
  if (!isInTurn.value) {
    useNotify('不在出牌阶段')
    if (roomStore.selectCards.has(i)) {
      roomStore.unSelectCard(i)
    }
    return;
  }
  if (!useCheckCard(card)) {
    useNotify('该牌不能出')
    if (roomStore.selectCards.has(i)) {
      roomStore.unSelectCard(i)
    }
    return;
  }
  if (roomStore.selectCards.has(i)) {
    roomStore.unSelectCard(i)
  } else {
    roomStore.selectCard(i)
  }
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
  socketStore.getOneCard(roomStore.roomCode).then((data) => {
    if (data) {
      const { card, userCards } = data;
      roomStore.setUserCards(userCards);
      if (useCheckCard(card)) {
        Dialog({
          title: '获得的牌符合规则',
          content: '是否打出此牌？',
          comfirm: (close) => {
            const idx = roomStore.userCards.findIndex(c => c.type === card.type && c.color === card.color)
            socketStore.outOfCard([idx], roomStore.roomCode).then((data) => {
              if (data) {
                roomStore.setUserCards(data)
              }
              close()
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

const handleUNO = () => {
  socketStore.uno(roomStore.roomCode)
}

</script>

<style scoped>

</style>
