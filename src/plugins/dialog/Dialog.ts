/**
 * 创建弹窗插件的调用方法
 */
import { createApp } from 'vue';
import DialogVue from './Dialog.vue';

export type OptionsType = {
  title: string,
  content:string,
  beforeClose?:Function
};

const Dialog = (options: OptionsType): void => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100vw'
  container.style.height = '100vh'
  container.style.position = 'absolute'
  container.style.top = '0';

  const app = createApp({
    methods:{
      closeDialog:()=>{
        options.beforeClose && options.beforeClose();
        app.unmount()
        document.body.removeChild(container)
      }
    },
    render() {
      return h(DialogVue, {
        ...options,
        visible:true,
        onClose: this.closeDialog
      })
    }
  })

  app.mount(container)
};

export default Dialog;

