<template>
  <div flex flex-col items-center justify="between" h-30>
    <div>起个名字吧！</div>
    <div>
      房间名：<input w-30 v-model="roomName" b="2 rounded-2 cool-gray-300" />
    </div>
    <button w-14 h-7 b="rounded-3" c="white" bg="cool-gray-500" @click="handleClick">Go!</button>
  </div>
</template>

<script setup lang="ts">
import useSocketStore from '~/store/socket';

const roomName = $ref('');

const socketStore = useSocketStore()

const handleClick = ()=>{
  socketStore.createRoom(roomName)
}
</script>

<style scoped>
</style>
