<template>
  <div  w="100%" overflow="scroll" flex flex-nowrap items-center>
    <EnemyPlayer v-for="player in players" :key="player.id" :name="player.name" :id="player.id" :cardNum="player.cards?.length" :last-card="player.lastCard" />
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';


const roomStore = useRoomStore()
const players = computed(()=>roomStore?.players)
</script>

<style scoped>
</style>
