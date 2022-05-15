<script setup lang="ts">
import { isInTurn, useCheckCard, useNotify } from '~/composables';
import { useRoomStore } from '~/store/room';


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
const containerClass = computed(() => isActive.value ? 'container translate-y-0' : 'container')

const canSelect = computed(() => useCheckCard(props))

const roomStore = useRoomStore()
const isActive = computed(()=>roomStore.selectCards.has(props.order));

const handleClick = () => {
  if(!isInTurn.value){
    useNotify('不在出牌阶段')
    return;
  }
  if (!canSelect.value) {
    useNotify('该牌不能出')
    return;
  }
  if(isActive.value){
    roomStore.unSelectCard(props.order)
  }else{
    roomStore.selectCard(props.order)
  }
}
</script>

<template>
  <div :class="containerClass" :style="{ backgroundColor: canSelect ? bgColor : bgColor + '22' }"
    w="20 sm:30" h="30 sm:40" relative justify-between @click="handleClick">
    <i :class="iconClass" absolute top-1 left-2/>
    <i :class="iconClass" absolute bottom-1 right-2/>
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
