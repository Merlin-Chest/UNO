<template>
  <div flex w="100%" h="100%" flex-col items-center justify="between" overflow="hidden" m="auto">
    <enemy-area></enemy-area>
    <i w-25 h-25  :style="{ color: gameLastCard?.color+'66' || '#9a9a9a66',fontSize:'8rem' }" flex
      items-center justify="center" :class="iconClass"></i>
    <CardArea w="100%" overflow="visible" @deal-card="handleDealCards"></CardArea>
  </div>
  <Teleport to="body">
    <Dialog absolute top="0" :visible="showColorPicker" title="选择颜色" @close="showColorPicker = false" @confirm="submitColor" :show-cancel='false'>
      <div flex flex-wrap items-center text-center justify="between">
        <label w="50%">
          <input type="radio" name="selectColor" value="#FF6666" checked @change="selectColor = '#FF6666'">
          红色
        </label>
        <label w="50%">
          <input type="radio" name="selectColor" value="#FFCC33" checked @change="selectColor = '#FFCC33'">
          黄色
        </label >
        <label w="50%">
          <input type="radio" name="selectColor" value="#99CC66" @change="selectColor = '#99CC66'">
          绿色
        </label>
        <label w="50%">
          <input type="radio" name="selectColor" value="#99CCFF" @change="selectColor = '#99CCFF'">
          蓝色
        </label>
    </div>
    </Dialog >
  </Teleport>
</template>
<script setup lang="ts">
import { useNotify } from '~/composables';
import { useRoomStore } from '~/store/room';
import useSocketStore from '~/store/socket';

const router = useRouter()

const socketStore = useSocketStore();
const roomStore = useRoomStore()

const gameLastCard = computed(() => roomStore.lastCard)
const iconClass = computed(() => `i ${roomStore.lastCard?.icon || 'pixelarticons:downasaur'}`)

const selectColor = ref<CardColor>('#FF6666')
const showColorPicker = ref(false)
const submitColor = ()=>{
  socketStore.submitColor(selectColor.value,roomStore.roomCode)
}

const handleDealCards = (cardsIndex: Set<number>) => {
  socketStore.outOfCard(Array.from(cardsIndex), roomStore.roomCode).then((res) => {
    const { message, data } = res
    useNotify(message);
    if (data) {
      roomStore.setUserCards(data)
    }
  })
}

onBeforeMount(() => {
  socketStore.socket.on('NEXT_TURN', (res) => {
    const { message, data: { lastCard, order, players } } = res
    useNotify(message);
    roomStore.setRoomInfoProp<'lastCard'>('lastCard', lastCard);
    roomStore.setRoomInfoProp<'order'>('order', order);
    roomStore.setRoomInfoProp<'players'>('players', players);
  })
  socketStore.socket.on('GAME_IS_OVER', (res) => {
    const { message, data: { winnerOrder, endTime } } = res
    useNotify(message);
    roomStore.setRoomInfoProp<'winnerOrder'>('winnerOrder', winnerOrder);
    roomStore.setRoomInfoProp<'endTime'>('endTime', endTime);
    router.push('/end')
  })
  socketStore.socket.on('SELECT_COLOR',(res)=>{
    const {message} = res;
    useNotify(message);
    showColorPicker.value = true;
  })
  socketStore.socket.on('COLOR_IS_CHANGE',(res)=>{
    const {message,data} = res;
    useNotify(message);
    roomStore.setRoomInfoProp<'lastCard'>('lastCard',Object.assign(roomStore.lastCard,{color:data}));
  })
})

onUnmounted(() => {
  socketStore.socket.off('NEXT_TURN')
  socketStore.socket.off('GAME_IS_OVER')
  socketStore.socket.off('UPDATE_PLAYER_LIST');
  socketStore.socket.off('SELECT_COLOR');
  socketStore.socket.off('COLOR_IS_CHANGE');
})

</script>
