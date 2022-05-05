<template>
  <div flex items-center justify="between">
    <div w-40 text-start>ID：{{ roomId }}</div>
    <div flex-1>房间号:
      <button flex-1 b="b-4 dashed transparent hover:red" @click="copy()">{{ roomCode }}</button>
    </div>
    <div w-40 text-end>{{ roomName }}</div>
  </div>
  <div flex p-30 flex-wrap>
    <PlayerInfo v-for="(player, i) in players" :key="player.id + player.name" :id="player.id" :name="player.name">
      {{ i === 0 ? '' : i }}
    </PlayerInfo>
  </div>
  <div>
    <button v-if="isOwner" text="3.5" c-red b="red rounded-10 3 dashed hover:transparent" transition="duration-400"
      hover="bg-red-400 text-white" px-3 py-1 @click="">
      开始游戏
    </button>
    <div v-else m-b-3>等待玩家进入...</div>
    <button m-l-3 c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
      hover="bg-gray text-white" px-3 py-1 @click="">
      {{ isOwner ? '解散房间' : '退出房间' }}
    </button>
  </div>

</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import useSocketStore from '~/store/socket';
import PlayerInfo from '~/components/wait/PlayerInfo.vue';
import useUserStore from '~/store/user';
import { useClipboard } from '@vueuse/core'


const roomStore = useRoomStore()
const userStore = useUserStore()

const roomId = computed(() => roomStore.roomId)
const roomName = computed(() => roomStore.roomName)
const roomCode = computed(() => roomStore.roomCode)
const players = computed(() => roomStore.players)

const { copy } = useClipboard({ source: roomCode })


const isOwner = computed(() => roomStore.owner.id === userStore.id && roomStore.owner.name === userStore.name)

const socketStore = useSocketStore();
socketStore.socket.on('UPDATE_PLAYER_LIST', (res) => {
  const { data, message } = res;
  if (message) {
    // TODO
  }
  roomStore.updatePlayers(data)
})
</script>

<style scoped>
</style>
