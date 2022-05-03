<template>
  <div flex flex-wrap>
    <EnemyPlayer v-for="player in players" :key="player.id" 
    :name="player.name" :id="player.id" :num="player.num" />
  </div>
</template>

<script setup lang="ts">
const players = ref([{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
},{
  name: 'merlin',
  id: '111',
  num: 0
}])
</script>

<style scoped>

</style>
