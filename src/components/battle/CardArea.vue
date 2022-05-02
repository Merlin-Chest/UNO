<template>
  <div flex justify-between ref="area">
    <Card v-for="(card, i) in cards" :style="{ marginLeft: i > 0 ? `-${interval}px` : 0, zIndex: i }" :key="card.type + card.color"
      :type="card.type" :color="card.color" :icon="card.icon">
    </Card>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  cards?: CardProps[]
}>(), {})

let area = $ref<HTMLElement>();

const interval = computed(() => {
  if (!props.cards?.length || props.cards.length === 0 || !area) return 0;
  const cardWidth = area.children[0].clientWidth;
  const res = (area.offsetWidth - cardWidth) / (props.cards.length - 1)
  return res;
})

</script>

<style scoped>
</style>
