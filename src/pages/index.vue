<template>
  <div flex flex-col items-center justify="between" h-60>
    <div>起个名字吧！</div>
    <div>
      你的名字：<input w-30 v-model="roomName" b="2 rounded-2 cool-gray-300" />
    </div>
    <div>
      进入房间名：<input w-30 v-model="roomName" b="2 rounded-2 cool-gray-300" />
    </div>
    （不存在房间将重新创建）
    <button w-14 h-7 b="rounded-3" c="white" bg="cool-gray-500" @click="handleClick">Go!</button>
  </div>
</template>

<script setup lang="ts">
import useSocketStore from '~/store/socket';
const userName = $ref('');

const roomName = $ref('');

const socketStore = useSocketStore()

const handleClick = ()=>{
  socketStore.createUser(userName)
}
</script>

<style scoped>
</style>
