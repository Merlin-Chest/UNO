<script setup lang="ts">
import { useCheckCard, useNotify } from '~/composables';
import { useRoomStore } from '~/store/room';


type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type cardColor = '#FF6666' | '#99CC66' | '#99CCFF' | '#FFCC33'

type CardNumberType<T extends number> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

interface CardProps {
  icon: string,
  type: CardNumberType<zeroToNine> | CardOtherType
  color: cardColor | string,
  order:number
}

const props = defineProps<CardProps>()

// 样式相关
const bgColor = computed(() => `${props.color}`)
const iconClass = computed(() => `i ${props.icon}`)
const containerClass = computed(() => isActive.value ? 'container translate-y--8' : 'container')

const canSelect = computed(() => useCheckCard(props))

const roomStore = useRoomStore()
const isActive = computed(()=>roomStore.selectCards.has(props.order));

const handleClick = () => {
  if (!canSelect.value) {
    useNotify('该牌不能出')
    return;
  }
  if(isActive.value){
    roomStore.unSelectCard(props.order)
  }else{
    console.log('111:', 111)
    roomStore.selectCard(props.order)
  }
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
