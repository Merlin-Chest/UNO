import { defineStore } from "pinia";
import socket from "~/socket";

const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      socket:socket
    }
  },
  actions: {
    createUser(name:string){
      this.socket.emit('CREATE_USER',{
        type:'CREATE_USER',
        data:{
          id: Date.now().toString(),
          name,
        }
      })
    },
    createRoom(name: string) {
      this.socket.emit('CREATE_ROOM', {
        type: 'CREATE_ROOM',
        data: {
          id: Date.now().toString(),
          name,
        }
      })
    }
  }
})

export default useSocketStore
