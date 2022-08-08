<script setup lang="ts">
import { useCheckCard } from '~/composables';


type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type cardColor = '#FF6666' | '#99CC66' | '#99CCFF' | '#FFCC33'

type CardNumberType<T extends number> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

interface CardProps {
  cardId:number,
  icon: string,
  type: CardNumberType<zeroToNine> | CardOtherType
  color: cardColor | string,
  order:number
}

const props = defineProps<CardProps>()

// 样式相关
const bgColor = computed(() => `${props.color}`)
const iconClass = computed(() => `i ${props.icon}`)

const canSelect = computed(() => useCheckCard(props))

</script>

<template>
  <div class="container" 
  :style="{ 
    backgroundColor: canSelect ? bgColor : bgColor + '11', 
    }"
    w="20 sm:30" h="30 sm:40" relative justify-between>
    <i :class="iconClass" absolute top-1 left-2 :style="{
      color: canSelect ? 'white' : 'transparent'
    }" />
    <i :class="iconClass" absolute bottom-1 right-2 :style="{
      color: canSelect ? 'white' : 'transparent'
    }" />
  </div>
</template>

<style scoped>
.container {
  box-sizing: border-box;
  border-color: v-bind(color);
  border-radius: 10px;
  box-shadow: 5px 5px 5px 4px rgba(0, 0, 0, 0.1);
}

.i::before {
  width: 50px;
}

.i {
  font-size: 20px;
  text-align: center;
  color: white;
}
</style>
