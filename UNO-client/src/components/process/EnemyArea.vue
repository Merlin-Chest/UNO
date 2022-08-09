<template>
  <div  w="100%" overflow="scroll" flex flex-nowrap items-center :justify="isOverflow ?'start':'center'" ref="enemyArea">
    <EnemyPlayer v-for="player in players" :key="player.id" :name="player.name"
     :id="player.id" :cardNum="player.cards?.length" :last-card="player.lastCard" />
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';


const roomStore = useRoomStore()
const players = computed(()=>roomStore?.players)

const enemyArea = $ref<HTMLElement>()

const isOverflow = computed(()=>{
  if(!enemyArea) return false;
  const areaWidth = enemyArea.clientWidth;
  const itemWidth = enemyArea.children[0].clientWidth;
  return players.value.length * itemWidth > areaWidth;
  return 
})
</script>

<style scoped>
</style>
