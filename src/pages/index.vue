<script setup lang="ts">
import { cardInfomation } from '~/configs/baseConfigs'
console.log('cardInfomation:', cardInfomation)
</script>

<template>
  <div>
    <Card v-for="card in cardInfomation" :key="card.type" :type="card.type" :color="card.color" />
    <button
      class="m-3 text-sm btn"
    >
      Go
    </button>
  </div>
</template>
