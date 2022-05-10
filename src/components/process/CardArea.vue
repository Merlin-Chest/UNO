<template>
  <div flex justify-between ref="area">
    <Card v-for="(card, i) in cards" :style="{ marginLeft: i > 0 ? `-${interval}px` : 0, zIndex: i }"
      :key="card.type + card.color" :type="card.type" :color="card.color" :icon="card.icon" @select-card="selectCard(i)"
      @un-select-card="unSelectCard(i)">
    </Card>
  </div>
</template>

<script setup lang="ts">
import {useRoomStore} from '~/store/room';
const roomStore = useRoomStore();
const cards = computed(() => roomStore.userCards)

const selectList = ref<number[]>([]);

const selectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  selectList.value.push(i);
}

const unSelectCard = (i: number) => {
  if (i < 0 || i >= cards.value.length) return;
  let idx = selectList.value.indexOf(i)
  selectList.value.splice(idx, 1)
}


// const resetSelectList = () => {
//   selectList.value = []
// }

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
