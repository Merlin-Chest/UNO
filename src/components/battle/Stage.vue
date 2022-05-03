<template>
    <div flex flex-col items-center justify="between" overflow="hidden" b="dashed 4 rounded-4 cool-gray-300" w-240 h-150
        m="auto">
        <enemy-area></enemy-area>
        <button @click="handleClick">send</button>
        <CardArea w="90%"></CardArea>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '~/store/game';

const gameStore = useGameStore();
onBeforeMount(() => {
    gameStore.resetGameData()
    gameStore.getGameCards();
})

const handleClick = ()=>{
    
}

</script>

<style scoped>
</style>
