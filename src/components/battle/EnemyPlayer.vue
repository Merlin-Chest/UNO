<template>
  <div flex flex-col items-center justify="between" b="dashed 4 rounded-2 yellow-200" box="border" p-2 m-2>
    <div flex>
      <img width="50" height="50" />
      <div flex flex-col items-start text-3 m-l-1>
        <div>id:{{ id }}</div>
        <div>{{ name }}</div>
      </div>
    </div>
    <div flex items-center justify="around" w="100%">
      <i class="i mdi:cards-outline"></i>
      <div>{{ cardNum }}</div>
      <div w-5 h-5 b="rounded-50" :bg="lastCard.color">
        <i :class="iconClass" lh-5 color="white"></i>
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


const props  = withDefaults(defineProps<PlayerProps>(), {
  name: 'merlin',
  id: '111',
  cardNum: 3,
  lastCard: () => {
    return {
      type: 'number-1',
      color: 'red',
      icon: 'mdi:cards-outline'
    }
  }
})

const iconClass = computed(() => `i ${props.lastCard.icon}`)

</script>

<style scoped>
</style>
