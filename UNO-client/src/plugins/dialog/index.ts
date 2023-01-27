import { Plugin, App } from 'vue';
import Dialog from './Dialog.vue';

const install = (app: App) => {
  app.component('Dialog', Dialog);
  return app;
}

export default install as Plugin
