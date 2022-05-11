<template>
  <div flex flex-wrap items-center>
    <EnemyPlayer v-for="player in players" :key="player.id" :name="player.name" :id="player.id" :cardNum="player.cardNum" :last-card="player.lastCard" />
  </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';
import useUserStore from '~/store/user';


const roomStore = useRoomStore()
const userStore = useUserStore()
const players = computed(()=>roomStore.players.filter(player=>player.id!==userStore.id && player.name !== userStore.name))
</script>

<style scoped>
</style>
