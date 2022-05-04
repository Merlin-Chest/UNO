<template>
    <div flex flex-col items-center justify="between" overflow="hidden"
        m="auto">
        <enemy-area></enemy-area>
        <button @click="handleClick">send</button>
        <CardArea w="90%"></CardArea>
    </div>
</template>

<script setup lang="ts">
import { useRoomStore } from '~/store/room';

const roomStore = useRoomStore();
onBeforeMount(() => {
    roomStore.resetGameData()
})

const handleClick = ()=>{
    
}

</script>

<style scoped>
</style>
