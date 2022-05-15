<template>
  <div flex="col" w="100%" h="100%" text="4 sm:6" c="gray" justify-around items-center>
    <!-- <div flex flex-col justify-center items-center h="20%">
      游戏时长
      <div>{{ timestampDiff(gameTime) }}</div>
    </div> -->
    <div flex flex-col justify-center items-center h="50%">
      游戏排名
      <div flex flex-col b="x-1 t-1">
        <div v-for="(p, i) in winnerOrder" :key="p.socketId" flex align="items-center" justify="center">
          <div w-18 b="r-1 b-1">{{ i + 1 }}</div>
          <div w-40 b="b-1">{{ p.name }}</div>
        </div>
      </div>
    </div>
    <div flex justify-center items-center h="20%">
    <button w-24 h-10 m-l-3 c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
      hover="bg-gray text-white" px-3 py-1 @click="backToIndex">
      返回首页
    </button></div>
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
// import { timestampDiff } from '~/utils';
const router = useRouter()
const roomStore = useRoomStore();

// const gameTime = computed(() => roomStore.endTime - roomStore.startTime)
const winnerOrder = computed(() => roomStore.winnerOrder)

const backToIndex = () => {
  roomStore.cleanRoom(router);
}

</script>

<style scoped>
</style>
