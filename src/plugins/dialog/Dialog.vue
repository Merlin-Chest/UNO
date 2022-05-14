<template>
  <div v-if="visible" z-99 flex flex-col items-center justify="center" w="100%" h="100%" bg="#00000033">
    <div flex flex-col justify="between" relative w="80" :bg="isDark ? 'black' : 'white'" b="rounded-4 gray-300 4 dashed">
      <button absolute top="1" right="2" @click="handleClose">X</button>
      <div b="b-4 gray-300 dashed" min-h="10" p="2" c="gray-700 dark:gray-200">
        <slot name="title">
          <h1>{{ title }}</h1>
        </slot>
      </div>
      <div c="gray-700" p="2">
        <slot>
          <div>{{ content }}</div>
        </slot>
      </div>
      <div flex items-center b="t-4 gray-300 dashed" p-2 justify="evenly">
        <button text="3.5" c-gray b="gray rounded-10 3 dashed hover:transparent" transition="duration-400"
          hover="bg-gray-400 text-white" px-3 py-1 @click="handleConfirm">
          确认
        </button>
        <button v-if="showCancel" text="3.5" c-red b="red rounded-10 3 dashed hover:transparent" transition="duration-400"
          hover="bg-red-400 text-white" px-3 py-1 @click="handleCancel">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isDark } from '~/composables'

interface DialogProps {
  title?: string;
  visible?: boolean;
  content?: string;
  showCancel?:boolean
}

const emit = defineEmits(['close', 'open', 'confirm', 'cancel'])

withDefaults(defineProps<DialogProps>(), {
  title: '',
  content: '',
  visible:true,
  showCancel: true
})

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
  emit('close')
}

const handleCancel = () => {
  emit('cancel')
  emit('close')
}
</script>

<style scoped>
</style>
