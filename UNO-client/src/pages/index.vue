<template>
  <div flex flex-col items-center justify="between" h-60>
    <h1 flex items-center text-10 r p-2 font-600>
      <span :style="{
        transform: `translate3d(${y / 300}px, ${x / 700 - 10}px, 0)`
      }">来</span>
      <span transform=" gpu" :style="{
        transform: `translate3d(${y / -200}px, ${y / 200}px, 0)`
      }">一</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${x / 700}px, -${y / 200}px, 0)`
      }">局</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${y / -300}px, -10px, 0)`
      }">U</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${x / 100}px, 5px, 0)`
      }">N</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${x / -600}px, -10px, 0)`
      }">O</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${x / 200}px, -${y / 200}px, 0)`
      }">吧</span>
      <span transform="gpu" :style="{
        transform: `translate3d(${x / 200}px, ${y / 200}px, 0)`
      }">!</span>
    </h1>
    <div>
      昵称：<input w-30 v-model="userName" b="2 rounded-2 cool-gray-300" />
    </div>
    <div flex w-45 justify="between">
      <label>
        <input type="radio" value="joinRoom" v-model="roomType">
        加入房间
      </label>
      <label>
        <input type="radio" value="createRoom" v-model="roomType">
        创建房间
      </label>
    </div>
    <div>
      {{ roomTip }}：<input w-30 v-model="roomAns" b="2 rounded-2 cool-gray-300" />
    </div>
    <button w-14 h-7 b="rounded-3" c="white" bg="cool-gray-500" hover="scale-105" transition="duration-300"
      @click="handleClick">Go !</button>
  </div>
</template>

<script setup lang="ts">
import { useNotify } from '~/composables';
import { useRoomStore } from '~/store/room';
import useSocketStore from '~/store/socket';
import useUserStore from '~/store/user';
const userName = $ref('');
const roomAns = $ref('');

const roomType = ref<'joinRoom' | 'createRoom'>('joinRoom')
const roomTip = computed(() => roomType.value === 'joinRoom' ? '房间代码' : '房间名称')

const router = useRouter()
const socketStore = useSocketStore()
const userStore = useUserStore()
const roomStore = useRoomStore()

const { x, y } = useMouse()

const handleClick = () => {
  if (!userName) {
    useNotify('请输入昵称')
    return
  }
  if (!roomAns) {
    useNotify('请输入' + roomTip.value)
    return
  }
  socketStore.createUser(userName).then((user) => {
    if (user) {
      userStore.setUserInfo(user)
      return socketStore[roomType.value](roomAns, userStore.getUserInfo())
    }
    return Promise.reject('创建玩家失败');
  }).then((roomInfo) => {
    if (roomInfo) {
      roomStore.setRoomInfo(roomInfo)
      router.push('/wait');
      return;
    }
    return Promise.reject('创建房间失败');
  })
}

</script>

<style scoped>

</style>
