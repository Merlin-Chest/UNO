<template>
  <div flex w="100%" h="100%" flex-col items-center justify="between" m="auto">
    <enemy-area></enemy-area>
    <i w-25 h-25 :style="{ color: gameLastCard?.color + '66' || '#9a9a9a66', fontSize: '8rem' }" flex items-center
      justify="center" :class="iconClass" relative left="7"></i>
    <CardArea w="100%" overflow="visible" @deal-card="handleDealCards"></CardArea>
  </div>
  <Teleport to="body">
    <Dialog absolute top="0" :visible="showColorPicker" title="选择颜色" @close="showColorPicker = false"
      @confirm="submitColor" :show-cancel='false'>
      <div flex flex-wrap items-center text-center justify="between">
        <label w="50%">
          <input type="radio" value="#FF6666" v-model="selectColor">
          红色
        </label>
        <label w="50%">
          <input type="radio" value="#FFCC33" v-model="selectColor">
          黄色
        </label>
        <label w="50%">
          <input type="radio" value="#99CC66" v-model="selectColor">
          绿色
        </label>
        <label w="50%">
          <input type="radio" value="#99CCFF" v-model="selectColor">
          蓝色
        </label>
      </div>
    </Dialog>
  </Teleport>
</template>
<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import useSocketStore, { eventBus } from '~/store/socket';

const router = useRouter()

const socketStore = useSocketStore();
const roomStore = useRoomStore();

const gameLastCard = computed(() => roomStore.lastCard)
const iconClass = computed(() => `i ${roomStore.lastCard?.icon || 'pixelarticons:downasaur'}`)

const selectColor = ref<CardColor>('#FF6666')
const showColorPicker = ref(false)
const submitColor = () => {
  socketStore.submitColor(selectColor.value, roomStore.roomCode);
  selectColor.value = '#FF6666'
}

const handleDealCards = (cardsIndex: Set<number>) => {
  socketStore.outOfCard(Array.from(cardsIndex), roomStore.roomCode).then((data) => {
    if (data) {
      roomStore.setUserCards(data)
    }
  })
}

onBeforeMount(() => {
  eventBus.on('NEXT_TURN', ({ lastCard, order, players }) => {
    roomStore.setRoomInfoProp<'lastCard'>('lastCard', lastCard);
    roomStore.setRoomInfoProp<'order'>('order', order);
    roomStore.setRoomInfoProp<'players'>('players', players);
  })
  eventBus.on('GAME_IS_OVER', ({ winnerOrder, endTime }) => {
    roomStore.setRoomInfoProp<'winnerOrder'>('winnerOrder', winnerOrder);
    roomStore.setRoomInfoProp<'endTime'>('endTime', endTime);
    router.push('/end')
  })
  eventBus.on('SELECT_COLOR', () => {
    showColorPicker.value = true;
  })
  eventBus.on('COLOR_IS_CHANGE', (data) => {
    roomStore.setRoomInfoProp<'lastCard'>('lastCard', Object.assign(roomStore.lastCard as CardInfo, { color: data }));
  })
  eventBus.on('RES_DEAL_CARDS', (data) => {
    roomStore.setUserCards(data)
  })
  eventBus.on('CHANGE_UNO_STATUS', (data) => {
    roomStore.changePlayerUNOStatus(data)
  })
})

onBeforeUnmount(() => {
  eventBus.removeAllListeners('NEXT_TURN')
  eventBus.removeAllListeners('GAME_IS_OVER')
  eventBus.removeAllListeners('UPDATE_PLAYER_LIST');
  eventBus.removeAllListeners('SELECT_COLOR');
  eventBus.removeAllListeners('COLOR_IS_CHANGE');
  eventBus.removeAllListeners('DEAL_CARDS');
  eventBus.removeAllListeners('CHANGE_UNO_STATUS');
})

</script>
