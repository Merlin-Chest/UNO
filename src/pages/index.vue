<script setup lang="ts">
import { useCards } from '~/hooks/card'

const cards = useCards()
console.log('cards:', cards)
</script>

<template>
  <div>
    <Card v-for="(card,i) in cards" :key="i" :type="card.type" :color="card.color" :icon="card.icon" />
    <button
      class="m-3 text-sm btn"
    >
      Go
    </button>
  </div>
</template>
