<script setup lang="ts">
const props = defineProps({
  type: {
    type: String,
    default: 'default',
  },
  color: {
    type: String,
    default: 'white',
  },
})

const content = computed(() => {
  if (props.type.startsWith('number-'))
    return props.type.replace('number-', '')
  else if (props.type === 'default')
    return 'default'
})
</script>

<template>
  <div w="30" h="40" flex-col :style="{alignItems:'center',justifyContent:'center',backgroundColor: color}" inline-block>
    <div class="text">
      {{ content }}
    </div>
    <div class="icon" w="10" h="10" bg="black" inline-block />
  </div>
</template>

<style scoped>

</style>
