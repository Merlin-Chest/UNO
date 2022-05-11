<script setup lang="ts">
import { useCheckCard } from '~/hooks/game';
import notify from '~/plugins/notification/notify';


type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type cardColor = '#FF6666' | '#99CC66' | '#99CCFF' | '#FFCC33'

type CardNumberType<T extends number> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

interface CardProps {
  icon: string,
  type: CardNumberType<zeroToNine> | CardOtherType
  color: cardColor | string
}

const props = withDefaults(defineProps<CardProps>(), {
  type: 'number-0',
  color: '',
  icon: '',
})
const emit = defineEmits(['selectCard', 'unSelectCard']);
// const content = computed(() => {
//   if (props.type.startsWith('number-'))
//     return props.type.replace('number-', '')
//   else return props.type
// })

// 样式相关
const bgColor = computed(() => `${props.color}`)
const iconClass = computed(() => `i ${props.icon}`)
const containerClass = computed(() => isActive.value ? 'container translate-y--8' : 'container')

const canSelect = computed(() => useCheckCard(props))

const isActive = ref(false);
const handleClick = () => {
  if (!canSelect.value) {
    notify({ content: '该牌不能出' })
    return;
  }
  emit(isActive ? 'selectCard' : 'unSelectCard')
  isActive.value = !isActive.value
}
</script>

<template>
  <div :class="containerClass" :style="{ backgroundColor: canSelect ? bgColor : bgColor + '22' }" transition="duration-150"
    w-30 h-40 inline-block flex justify-between hover="translate-y--8" @click="handleClick">
    <i :class="iconClass" m="l-2 t-1" />
    <i :class="iconClass" lh="70" m="r-2" />
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  border-color: v-bind(color);
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
