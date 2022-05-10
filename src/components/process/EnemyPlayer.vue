<template>
  <div :h="inOrder ? 26 : 22" :w="inOrder ? 44 : 40" flex flex-col items-center justify="between" b="dashed 4 rounded-2" :style="{
    borderColor: lastCard?.color || 'grey'
  }" box="border" p-2 m-2>
    <div flex>
      <img :w="inOrder ? 14 : 10" :h="inOrder ? 14 : 10" :src="avatarSrc" b="rounded-2" />
      <div flex flex-col items-start :text='inOrder ? 4 : 3' m-l-1>
        <div max-w-12 max-w-20 overflow-hidden text-ellipsis>No.{{ id }}</div>
        <div min-w-8 max-w-20 overflow-hidden text-ellipsis>{{ name }}</div>
      </div>
    </div>
    <div flex items-center w-4 h-4 lh-4 justify="around" w="100%" m-t-1  :style="{ color: lastCard?.color || 'grey' }">
      <i w-4 h-4 class="i mdi:cards-outline"></i>
      <div>{{ cardNum }}</div>
      <i w-4 h-4 :class="iconClass"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateFromString } from 'generate-avatar'
import { useRoomStore } from '~/store/room';
export interface PlayerProps {
  id: string,
  name: string,
  cardNum: number,
  lastCard: CardProps | null
}

const props = withDefaults(defineProps<PlayerProps>(), {
  name: '无玩家',
  id: '-1',
  cardNum: 0,
  lastCard: null
})

const roomStore = useRoomStore()

const iconClass = computed(() => `i ${props.lastCard?.icon || 'pixelarticons:downasaur'}`)
const avatarSrc = computed(() => `data:image/svg+xml;utf8,${generateFromString(props.id + props.name)}`)
const inOrder = computed(() => {
  const idx = roomStore.players.findIndex(p => p.id === props.id && p.name === props.name)
  return idx === roomStore.order
})
</script>

<style scoped>
</style>
