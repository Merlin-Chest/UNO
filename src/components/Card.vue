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

const bgColor = computed(() => `${props.color}`)
const iconClass = computed(() => `i ${props.icon}`)
</script>

<template>
  <div class="container" w-30 h-40 inline-block flex justify-between hover="translate-y--8">
    <i :class="iconClass" m="l-2" />
    <i :class="iconClass" lh="70" />
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  border-color: v-bind(color);
  background-color: v-bind(bgColor);
  border-radius: 10px;
  box-shadow: 10px 20px 20px 20px rgba(0, 0, 0, 0.1);
}

.i::before {
  width: 50px;
}

.i {
  font-size: 20px;
  text-align: center;
  color: white;
  height: 100%;
}
</style>
