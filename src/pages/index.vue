<template>
  <div flex flex-col items-center justify="between" h-50>
    <div>来一局UNO吧！</div>
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
    <button w-14 h-7 b="rounded-3" c="white" bg="cool-gray-500" @click="handleClick">Go!</button>
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

const handleClick = () => {
  if (!userName) {
    useNotify('请输入昵称')
    return
  }
  if (!roomAns) {
    useNotify('请输入' + roomTip.value)
    return
  }
  socketStore.createUser(userName).then((res) => {
    const {data:user}= res
    userStore.setUserInfo(user)
    return socketStore[roomType.value](roomAns, userStore.getUserInfo())
  }).then((res) => {
    const {data:roomInfo,message} = res
    useNotify(message)
    if(roomInfo){
      roomStore.setRoomInfo(roomInfo)
      router.push('/wait')
    }
  });
}

</script>

<style scoped>
</style>
