<template>
  <div w="100%" h="100%" flex flex-col justify="between" pb-6>
    <div flex flex-wrap items-center justify="between">
      <div w-40 text-start display="none sm:block">ID：{{ roomId }}</div>
      <div flex-1>房间号:
        <button flex-1 b="b-4 dashed transparent hover:red" @click="copyCode">{{ roomCode }}</button>
      </div>
      <div w-40 text-end display="none sm:block">{{ roomName }}</div>
    </div>
    <div flex flex-wrap items-start max-h="70%" overflow="scroll" justify="center">
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
import { useNotify } from '~/composables';
import Dialog from '~/plugins/dialog/Dialog';


const roomStore = useRoomStore()
const userStore = useUserStore()

const roomId = computed(() => roomStore.roomId)
const roomName = computed(() => roomStore.roomName)
const roomCode = computed(() => roomStore.roomCode)
const players = computed(() => roomStore.players)
const isOwner = computed(() => roomStore?.owner?.id === userStore?.id && roomStore?.owner?.name === userStore?.name)

const { copy } = useClipboard({ source: roomCode })

const copyCode =()=>{
  copy();
  useNotify('复制成功')
}

const router = useRouter()

const socketStore = useSocketStore();

onBeforeMount(() => {
  // 监听玩家列表变化
  socketStore.socket.on('UPDATE_PLAYER_LIST', (res) => {
    const { data: players, message } = res;
    useNotify(message);
    roomStore.updatePlayers(players)
  })

  // 监听游戏是否开始
  socketStore.socket.on('GAME_IS_START', (res) => {
    const { data: { roomInfo, userCards }, message } = res;
    useNotify(message);
    socketStore.socket.once('NEXT_TURN', (res) => {
      const { data: { lastCard, order, players } } = res
      roomStore.setRoomInfoProp<'lastCard'>('lastCard', lastCard);
      roomStore.setRoomInfoProp<'order'>('order', order);
      roomStore.setRoomInfoProp<'players'>('players', players);
    })
    roomStore.setRoomInfo(roomInfo)
    roomStore.setUserCards(userCards);
    router.push('/process')
  })


  // 监听房间是否解散
  socketStore.socket.on('RES_DISSOLVE_ROOM', (res) => {
    const { message } = res;
    useNotify(message);
    roomStore.cleanRoom(router);
  })
})

onUnmounted(() => {
  socketStore.socket.off('GAME_IS_START');
  socketStore.socket.off('RES_DISSOLVE_ROOM');
})

// 开始游戏
const startGame = () => {
  socketStore.startGame(roomCode.value).then((res) => {
    const { message } = res;
    useNotify(message)
  })
}

// 解散或离开房间
const dissolveOrLeaveRoom = () => {
  Dialog({
    title: isOwner.value ? '解散房间' : '离开房间',
    content: '是否确认？',
    comfirm: () => {
      if (isOwner.value) {
        socketStore.dissolveGame(roomCode.value)
      } else {
        socketStore.leaveGame(roomCode.value, userStore.getUserInfo()).then((res) => {
          const { message } = res;
          useNotify(message)
          roomStore.cleanRoom(router);
        })
      }
    }
  })

}
</script>

<style scoped>
</style>
