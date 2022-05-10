import { Plugin, App } from 'vue';
import Notification from './Notification.vue'
import notify from './notify';

const install = (app: App)=>{
  app.config.globalProperties.$notify = notify;
  app.component(Notification.name, Notification);
  return app;
}

export default install as Plugin
