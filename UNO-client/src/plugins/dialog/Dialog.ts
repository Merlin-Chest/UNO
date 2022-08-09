/**
 * 创建弹窗插件的调用方法
 */
import { createApp,App } from 'vue';
import DialogVue from './Dialog.vue';

export type OptionsType = {
  title: string,
  content:string,
  comfirm?:(close:Function)=>void
  cancel?:(close:Function)=>void
  showCancel?:boolean
};

const removeInstance = (app:App<Element>,container:Element)=>{
  app.unmount()
  document.body.removeChild(container)
}

const Dialog = (options: OptionsType): void => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.style.width = '100vw'
  container.style.height = '100vh'
  container.style.position = 'absolute'
  container.style.top = '0';

  const app = createApp({
    methods:{
      closeDialog(){
        removeInstance(app,container)
      },
      handleConfirm(){
        options.comfirm && options.comfirm(this.closeDialog)
      },
      handleCancel(){
        options.cancel && options.cancel(this.closeDialog)
      }
    },
    render() {
      return h(DialogVue, {
        ...options,
        visible:true,
        onClose: this.closeDialog,
        onConfirm:this.handleConfirm,
        onCancel:this.handleCancel
      })
    }
  })

  app.mount(container)
};

export default Dialog;

