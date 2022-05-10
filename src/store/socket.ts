import { defineStore } from "pinia";
import type { ServerDataType, ServerKeys } from "~/types/server";
import socket from "~/socket";

const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      socket
    }
  },
  actions: {
    Promisify<T>(eventName: ServerKeys) {
      return new Promise<T>((resolve, reject) => {
        this.socket.once(eventName, (res: any) => {
          resolve(res)
        })
      })
    },
    createUser(name: string) {
      this.socket.emit('CREATE_USER', {
        type: 'CREATE_USER',
        data: {
          id: Date.now().toString(),
          name,
        }
      })
      return this.Promisify<ServerDataType<'RES_CREATE_USER',UserInfo>>('RES_CREATE_USER')
    },
    createRoom(name: string, owner: UserInfo) {
      this.socket.emit('CREATE_ROOM', {
        type: 'CREATE_ROOM',
        data: {
          roomId: Date.now().toString(),
          roomName: name,
          owner
        }
      })
      return this.Promisify<ServerDataType<'RES_CREATE_ROOM',RoomInfo>>('RES_CREATE_ROOM')
    },
    joinRoom(code: string, userInfo: UserInfo) {
      this.socket.emit('JOIN_ROOM', {
        type: 'JOIN_ROOM',
        data: {
          roomCode: code,
          userInfo
        }
      })
      return this.Promisify<ServerDataType<'RES_CREATE_ROOM',RoomInfo>>('RES_JOIN_ROOM')
    },
    startGame(code: string) {
      this.socket.emit('START_GAME', {
        type: 'START_GAME',
        data: code
      })
    },
    dissolveGame(code: string) {
      this.socket.emit('DISSOLVE_ROOM', {
        type: 'DISSOLVE_ROOM',
        data: code
      })
    },
    leaveGame(code: string,userInfo:UserInfo) {
      this.socket.emit('LEAVE_ROOM', {
        type: 'LEAVE_ROOM',
        data:{
          roomCode:code,
          userInfo,
        }
      })
      return this.Promisify<ServerDataType<'RES_LEAVE_ROOM',null>>('RES_LEAVE_ROOM')
    },
  }
})

export default useSocketStore
