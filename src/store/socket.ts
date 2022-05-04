import { defineStore } from "pinia";
import socket from "~/socket";

const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      socket
    }
  },
  actions: {
    Promisify<T>(eventName: ServerToClientEventsKeys) {
      return new Promise<T>((resolve, reject) => {
        this.socket.on(eventName, (res) => {
          let { message, data } = res;
          if (message) {
            // 显示消息弹窗
          }
          resolve(data)
        })
      })
    },
    createUser(name: string) {
      this.socket.emit('CREATE_USER', {
        type: 'RES_CREATE_USER',
        data: {
          id: Date.now().toString(),
          name,
        }
      })
      return this.Promisify<UserInfo>('RES_CREATE_USER')
    },
    createRoom(name: string, owner: UserInfo) {
      this.socket.emit('CREATE_ROOM', {
        type: 'RES_CREATE_ROOM',
        data: {
          roomId: Date.now().toString(),
          roomName: name,
          owner
        }
      })
      return this.Promisify<RoomInfo>('RES_CREATE_ROOM')
    }
  }
})

export default useSocketStore
