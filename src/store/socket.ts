import { defineStore } from "pinia";
import socket from "~/socket";

const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      socket:socket
    }
  },
  actions: {
    createRoom(name: string) {
      this.socket.emit('CREATE_ROOM', {
        type: 'CREATE_ROOM',
        data: {
          id: Date.now().toString(),
          name
        }
      })
    }
  }
})

export default useSocketStore
