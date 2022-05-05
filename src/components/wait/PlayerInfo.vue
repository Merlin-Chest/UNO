<template>
  <div w-42>{{ isOwner ? '房主' : '玩家' }}<slot></slot>
    <div flex b="dashed 4 rounded-4 cool-gray-500" box="border" p-3 m-2 >
      <img width="50" height="50" :src="avatarSrc" b="rounded-2" />
      <div flex flex-col items-start text-3 m-l-1>
        <div max-w-12 max-w-20 overflow-hidden text-ellipsis>No.{{ id }}</div>
        <div min-w-8 max-w-20 overflow-hidden text-ellipsis>{{ name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { generateFromString } from 'generate-avatar'
import { useRoomStore } from '~/store/room';
const props = withDefaults(defineProps<{
  id: string,
  name: string,
}>(), {
  id: '-1',
  name: '无玩家',
})
const roomStore = useRoomStore()

const avatarSrc = computed(() => `data:image/svg+xml;utf8,${generateFromString(props.id + props.name)}`)
const isOwner = computed(() => roomStore._roomInfo.owner.id === props.id && roomStore._roomInfo.owner.name === props.name)

</script>

<style scoped>
</style>
