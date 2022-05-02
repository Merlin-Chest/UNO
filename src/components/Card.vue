<script setup lang="ts">
import type { CardProps } from '~/types/card';
const props = withDefaults(defineProps<CardProps>(), {
  type: 'number-0',
  color: '',
  icon: '',
})
const isActive = ref(false);
const emit = defineEmits(['selectCard', 'unSelectCard']);
// const content = computed(() => {
//   if (props.type.startsWith('number-'))
//     return props.type.replace('number-', '')
//   else return props.type
// })

const bgColor = computed(() => `${props.color}`)
const iconClass = computed(() => `i ${props.icon}`)
const containerClass = computed(() => isActive.value ? 'container translate-y--8' : 'container')

const handleClick = () => {
  emit(isActive ? 'selectCard' : 'unSelectCard')
  isActive.value = !isActive.value
}
</script>

<template>
  <div :class="containerClass" transition="duration-150" w-30 h-40 inline-block flex justify-between
    hover="translate-y--8" @click="handleClick">
    <i :class="iconClass" m="l-2 t-1" />
    <i :class="iconClass" lh="70" m="r-2" />
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
