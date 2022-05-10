<template>
<div w="100%" h="100%"> 
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
      hover="bg-red-400 text-white" px-3 py-1 @click="startGame">
      开始游戏
    </button>
    <div v-else m-b-3>等待玩家进入...</div>
    <button m-l-3 c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
      hover="bg-gray text-white" px-3 py-1 @click="dissolveOrLeaveRoom">
      {{ isOwner ? '解散房间' : '退出房间' }}
    </button>
  </div>
</div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import useSocketStore from '~/store/socket';
import PlayerInfo from '~/components/wait/PlayerInfo.vue';
import useUserStore from '~/store/user';
import { useClipboard } from '@vueuse/core'
import notify from '~/plugins/notification/notify';


const roomStore = useRoomStore()
const userStore = useUserStore()

const roomId = computed(() => roomStore.roomId)
const roomName = computed(() => roomStore.roomName)
const roomCode = computed(() => roomStore.roomCode)
const players = computed(() => roomStore.players)
const isOwner = computed(() => roomStore?.owner?.id === userStore?.id && roomStore?.owner?.name === userStore?.name)

const { copy } = useClipboard({ source: roomCode })

const router = useRouter()

const socketStore = useSocketStore();

onBeforeMount(()=>{
  // 监听玩家列表变化
  socketStore.socket.on('UPDATE_PLAYER_LIST', (res) => {
    const { data: players, message } = res;
    if (message) {
      notify({
        content:message
      })
    }
    roomStore.updatePlayers(players)
  })

  // 监听游戏是否开始
  socketStore.socket.on('GAME_IS_START', (res) => {
    const { data:{roomInfo,userCards}, message } = res;
    if (message && !isOwner.value) {
      notify({
        content:message
      })
    }
    roomStore.setRoomInfo(roomInfo)
    roomStore.addUserCards(userCards);
    router.push('/process')
  })


  // 监听房间是否解散
  socketStore.socket.on('RES_DISSOLVE_ROOM', (res) => {
    const { message } = res;
    if (message) {
      notify({
        content:message
      })
    }
    router.push('/')
    roomStore.cleanRoom();
  })
})

onBeforeUnmount(()=>{
  socketStore.socket.off('UPDATE_PLAYER_LIST');
  socketStore.socket.off('GAME_IS_START');
  socketStore.socket.off('RES_DISSOLVE_ROOM');
})

// 开始游戏
const startGame = () => {
  socketStore.startGame(roomCode.value)
}

// 解散房间
const dissolveOrLeaveRoom = () => {
  if (isOwner.value) {
    socketStore.dissolveGame(roomCode.value)
  } else {
    socketStore.leaveGame(roomCode.value, userStore.getUserInfo()).then((res) => {
      const { message } = res;
      if(message){
        notify({
          content:message
        })
      }
      router.push('/')
    })
  }
}
</script>

<style scoped>
</style>
