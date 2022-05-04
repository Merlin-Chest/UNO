<template>
  <div flex items-center justify="between">
    <div>id:{{ roomId }}</div>
    <div>房间代码：{{ roomCode }}
      <br />等待玩家进入...
    </div>
    <div>房间名:{{ roomName }}</div>
  </div>
  <div>
    {{ players }}
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import useSocketStore from '~/store/socket';

const roomStore = useRoomStore()


const roomId = computed(() => roomStore.roomId)
const roomName = computed(() => roomStore.roomName)
const roomCode = computed(() => roomStore.roomCode)
const players = computed(() => roomStore.players)

const socketStore = useSocketStore();
socketStore.socket.on('UPDATE_PLAYER_LIST', (res) => {
  const { data } = res;
  roomStore.updatePlayers(data)
})
</script>

<style scoped>
</style>
