<template>
    <div flex flex-col items-center justify="between" overflow="hidden" border="dashed 4 rounded-4 cool-gray-300" w-240
        h-150 m="auto">
        <div w="1000px" h="200px"></div>
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
