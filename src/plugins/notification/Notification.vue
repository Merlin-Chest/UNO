<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div
      v-show="visible"
      ref="root"
      class="notification"
      :style="styleObj"
      @mouseenter="clearTimer"
      @mouseleave="createTimer"
    >
      <span class="content">{{ content }}</span>
      <a class="btn" @click="handleClose">{{ btn }}</a>
    </div>
  </transition>
</template>

<script set lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount,StyleValue
} from 'vue';

export default defineComponent({
  name: 'Notification',
  props: {
    content: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 3000,
    },
    btn: {
      type: String,
      default: '关闭',
    },
    verticalOffset: {
      type: Number,
      default: 0,
    },
    onClosed: Function,
  },
  setup(props) {
    const root = ref(null!);

    const state = reactive({
      height: 0,
      visible: false,
    });

    const styleObj = computed<StyleValue>(() => ({
      position: 'fixed',
      right: '20px',
      bottom: `${props.verticalOffset}px`,
    }));

    const timer = ref(0);

    const handleClose = (e: MouseEvent): void => {
      e.preventDefault();
      state.visible = false;
    };

    const afterLeave = () => {
      (props as any).onClosed(state.height);
    };

    const afterEnter = () => {
      state.height = (root as any).value.offsetHeight;
    };

    const createTimer = () => {
      if (props.duration) {
        timer.value = setTimeout(() => {
          state.visible = false;
        }, props.duration) as unknown as number;
      }
    };

    const clearTimer = () => {
      if (timer.value) {
        clearTimeout(timer.value);
        timer.value = 0;
      }
    };

    onMounted(() => {
      state.visible = true;
      createTimer();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    // toRefs 把reactive创建出的数据变更为响应式
    return {
      ...toRefs(state),
      root,
      styleObj,
      handleClose,
      afterLeave,
      afterEnter,
      clearTimer,
      createTimer,
    };
  },
});
</script>

<style scoped>
.notification {
  display: inline-flex;
  background-color: white;
  color: rgb(130, 130, 130);
  align-items: center;
  padding: 16px;
  min-width: 280px;
  max-width: 400px;
  flex-wrap: wrap;
  padding-right: 50px;
  box-shadow: 0px 3px 5px -1px rgba(55, 55, 55, 0.072),
    0px 6px 10px 0px rgba(63, 63, 63, 0.14), 0px 1px 18px 0px rgba(57, 57, 57, 0.12);
  flex-wrap: wrap;
  transition: all 0.3s;
  border-radius: 20px;
  position: relative;
  font-size: 16px;
}
.content {
  padding: 0;
}
.btn {
  padding:0;
  cursor: pointer;
  border-radius: 20px;
  position:absolute;
  right:16px;
  top:8px;
  font-size: 10px;
  background-color: transparent;
  color:gray
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
