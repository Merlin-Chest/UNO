<template>
  <div flex flex-wrap>
    <EnemyPlayer v-for="player in players" :key="player.id" :name="player.name" :id="player.id" :cardNum="player.cardNum" :last-card="player.lastCard" />
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';


const roomStore = useRoomStore()
const players = computed(()=>roomStore.players)

// const players = ref([{
//   name: 'merlinmerlinmerlinmerlin',
//   id: '111',
//   cardNum: 0,
//   lastCard:{
//     type: 'number-1',
//     color: 'red',
//     icon: 'pixelarticons:downasaur'
//   } as CardProps
// },{
//   name: 'merlin',
//   id: '111',
//   cardNum: 0,
//   lastCard:{
//     type: 'number-1',
//     color: 'green',
//     icon: 'pixelarticons:downasaur'
//   } as CardProps
// }])
</script>

<style scoped>
</style>
