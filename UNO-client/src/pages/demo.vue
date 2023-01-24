<template>
  <div ref="cardContainer" relative w="80%" h="50" border="gray-300 3 opacity-50" rounded="2">
    <div v-for="(item, index) in styleConfig" :key="index" rounded-2 w="30" h="40" :bg="item.color" :style="{
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: `rotate(${item.rotate}deg) translate(-40%, 0)`,
      transformOrigin: item.transformOrigin
    }" hover="border-2 border-white" transition="duration-100" />
  </div>
</template>
<script setup lang="ts">
const cardContainer = ref()
const cardConfig = $ref([
  {
    color: 'yellow',
  }, {
    color: 'green',
  }, {
    color: 'red',
  }, {
    color: 'yellow',
  }, {
    color: 'green',
  }, {
    color: 'red',
  }, {
    color: 'yellow',
  }, {
    color: 'red',
  }, {
    color: 'yellow',
  }, {
    color: 'green',
  }, {
    color: 'red',
  }, {
    color: 'yellow',
  }, {
    color: 'red',
  },
])

const styleConfig = computed(() => {
  const tangle = Math.atan(cardContainer.value?.clientWidth / 2 / cardContainer.value?.clientHeight) * 180 / Math.PI;
  const space = tangle / (cardConfig.length - 1)
  return cardConfig.map((item, index) => {
    return {
      rotate: (index - cardConfig.length / 2) * space,
      transformOrigin: `0 ${cardContainer.value?.clientWidth / 2}px`,
      ...item,
    }
  })
})
</script>

<style scoped>

</style>
