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
  icon: {
    type: String,
    default: '',
  },
})

const content = computed(() => {
  if (props.type.startsWith('number-'))
    return props.type.replace('number-', '')
  else return props.type
})

const bgColor = computed(() => `${props.color}30`)

</script>

<template>
  <div
    w="30"
    h="40"
    :style="{
      boxSizing: 'border-box',
      border: '5px ' + color + ' solid',
      backgroundColor: bgColor,
      borderRadius: '10px',
    }"
    inline-block
  >
    <div
      :class="icon" :style="{color}" inline-block h="100%" w="40px"
    />
  </div>
</template>

<style scoped>
</style>
