<template>
    <div flex flex-col items-center justify="between" overflow="hidden" b="dashed 4 rounded-4 cool-gray-300" w-240
        h-150 m="auto">
        <enemy-area></enemy-area>
        <CardArea w="90%"></CardArea>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/store/game';


const store = useGameStore();
onBeforeMount(() => {
    store.resetGameData()
    store.getGameCards();
})
</script>

<style scoped>
</style>
