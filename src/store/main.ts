import { defineStore } from "pinia";

const useMainStore = defineStore('main', {
  state: () => {
    return {
      dialogShow:false
    }
  },
  actions: {
    openDialog(){
      this.dialogShow = true;
    },
    closeDialog(){
      this.dialogShow = false;
    }
  }
})

export default useMainStore
