<script setup lang="ts">
import type { CardProps } from '~/types/card';
const props = withDefaults(defineProps<CardProps>(), {
  type: 'number-0',
  color: '',
  icon: '',
})

// const content = computed(() => {
//   if (props.type.startsWith('number-'))
//     return props.type.replace('number-', '')
//   else return props.type
// })

const bgColor = computed(() => `${props.color}30`)
const iconClass = computed(() => `i fa6-solid:${props.icon}`)
</script>

<template>
  <div class="container" w="30" h="40" inline-block>
    <i :class="iconClass" flex align="items-center" justify="center" />
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  border: 5px v-bind(color) solid;
  background-color: v-bind(bgColor);
  border-radius: 10px;
}

.i::before {
  width: 50px;
}

.i {
  font-size: 80px;
  line-height: 200px;
  text-align: center;
  color: v-bind(color);
  height: 100%;
}
</style>
