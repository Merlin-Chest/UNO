<template>
  <div flex w="100%" h="100%" flex-col items-center justify="between" overflow="hidden" m="auto">
    <enemy-area></enemy-area>
    <i w-25 h-25  :style="{ color: gameLastCard?.color+'66' || '#9a9a9a66',fontSize:'8rem' }" flex
      items-center justify="center" :class="iconClass"></i>
    <CardArea w="100%" overflow="visible" @deal-card="handleDealCards"></CardArea>
  </div>
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
})

onUnmounted(() => {
  socketStore.socket.off('NEXT_TURN')
  socketStore.socket.off('GAME_IS_OVER')
  socketStore.socket.off('UPDATE_PLAYER_LIST');
})

</script>
