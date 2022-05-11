<template>
  <div flex justify-between ref="area">
    <Card v-for="(card, i) in cards" :style="{ marginLeft: i > 0 ? `-${interval}px` : 0, zIndex: i }"
      :key="card.type + card.color" :type="card.type" :color="card.color" :icon="card.icon" @select-card="selectCard(i)"
      @un-select-card="unSelectCard(i)">
    </Card>
    <div>
      <button v-show="isInTurn" c-gray text="3.5" b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
      hover="bg-gray text-white" px-3 py-1 @click="handleDealCards">出牌</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useRoomStore} from '~/store/room';
import { isInTurn } from '~/hooks/game';
import notify from '~/plugins/notification/notify';
const emit = defineEmits(['dealCard'])

const roomStore = useRoomStore();
const cards = computed(() => roomStore.userCards)

const selectList = ref<Set<number>>(new Set());

const selectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  selectList.value.add(i);
}

const handleDealCards = ()=>{
  if(selectList.value.size === 0){
    notify({content:'请选择要出的牌'})
    return;
  }
  emit('dealCard',selectList.value);
  selectList.value = new Set();
}

const unSelectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  selectList.value.delete(i)
}

let area = $ref<HTMLElement>();

const interval = computed(() => {
  if (!cards.value?.length || cards.value.length === 0 || !area) return 0;
  const cardWidth = area.children[0].clientWidth;
  const res = (area.offsetWidth - cardWidth) / (cards.value.length - 1)
  return res;
})

</script>

<style scoped>
</style>
