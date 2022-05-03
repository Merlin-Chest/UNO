<template>
  <div flex flex-col items-center justify="between" b="dashed 4 rounded-2 yellow-200" box="border" p-2 m-2>
    <div flex>
      <img width="50" height="50" />
      <div flex flex-col items-start text-3 m-l-1>
        <div>No.{{ id }}</div>
        <div>{{ name }}</div>
      </div>
    </div>
    <div flex items-center justify="around" w="100%">
      <i class="i mdi:cards-outline"></i>
      <div>{{ cardNum }}</div>
      <div w-5 h-5 :style="{
        backgroundColor: lastCard.color,
        borderRadius: '50%',
      }">
        <i :class="iconClass" lh-5 c="white"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface PlayerProps {
  id: string,
  name: string,
  cardNum: number,
  lastCard?: CardProps
}

const props = withDefaults(defineProps<PlayerProps>(), {
  name: '无玩家',
  id: '-1',
  cardNum: 0,
  lastCard: () => {
    return {
      type: 'ban',
      color: 'gray',
      icon: 'pixelarticons:downasaur'
    }
  }
})

const iconClass = computed(() => `i ${props.lastCard.icon}`)
</script>

<style scoped>
</style>
