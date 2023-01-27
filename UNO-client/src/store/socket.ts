import { defineStore } from "pinia";
import socket from "~/socket";
import EventEmitter from "events";
import type { ServerEvents } from '~/types/server';
import { RoomInfo } from "~/types/room";

export const eventBus = new EventEmitter()

const useSocketStore = defineStore('socket', {
  state: () => {
    return {
      socket
    }
  },
  actions: {
    Promisify<T>(eventName: ServerEvents) {
      return new Promise<T>((resolve) => {
        eventBus.once(eventName, resolve)
      })
    },
    createUser(name: string) {
      this.socket.send(JSON.stringify({
        type: 'CREATE_USER',
        data: {
          id: Date.now().toString(),
          name,
        }
      }))
      return this.Promisify<UserInfo>('RES_CREATE_USER')
    },
    createRoom(name: string, owner: UserInfo) {
      this.socket.send(JSON.stringify({
        type: 'CREATE_ROOM',
        data: {
          roomId: Date.now().toString(),
          roomName: name,
          owner
        }
      }))
      return this.Promisify<RoomInfo>('RES_CREATE_ROOM')
    },
    joinRoom(code: string, userInfo: UserInfo) {
      this.socket.send(JSON.stringify({
        type: 'JOIN_ROOM',
        data: {
          roomCode: code,
          userInfo
        }
      }))
      return this.Promisify<RoomInfo>('RES_JOIN_ROOM')
    },
    startGame(code: string) {
      this.socket.send(JSON.stringify({
        type: 'START_GAME',
        data: code
      }))
      return this.Promisify<null>('RES_START_GAME')
    },
    dissolveGame(code: string) {
      this.socket.send(JSON.stringify({
        type: 'DISSOLVE_ROOM',
        data: code
      }))
    },
    leaveGame(code: string, userInfo: UserInfo) {
      this.socket.send(JSON.stringify({
        type: 'LEAVE_ROOM',
        data: {
          roomCode: code,
          userInfo,
        }
      }))
      return this.Promisify<null>('RES_LEAVE_ROOM')
    },
    outOfCard(cardsIndex: number[], roomCode: string) {
      this.socket.send(JSON.stringify({
        type: 'OUT_OF_THE_CARD',
        data: {
          cardsIndex,
          roomCode,
        }
      }))
      return this.Promisify<CardInfo[] | null>('RES_OUT_OF_THE_CARD')
    },
    getOneCard(roomCode: string) {
      this.socket.send(JSON.stringify({
        type: 'GET_ONE_CARD',
        data: roomCode
      }))
      return this.Promisify<{
        card: CardInfo,
        userCards: CardInfo[]
      }>('RES_GET_ONE_CARD')
    },
    toNextTurn(roomCode: string) {
      this.socket.send(JSON.stringify({
        type: 'NEXT_TURN',
        data: roomCode
      }))
    },
    submitColor(color: CardColor, roomCode: string) {
      this.socket.send(JSON.stringify({
        type: 'SUBMIT_COLOR',
        data: {
          color,
          roomCode
        }
      }))
    },
    uno(roomCode: string) {
      this.socket.send(JSON.stringify({
        type: 'UNO',
        data: roomCode
      }))
    }
  }
})

export default useSocketStore
