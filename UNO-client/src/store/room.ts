import { defineStore } from 'pinia'
import { Router } from 'vue-router';

export const useRoomStore = defineStore('game', {
  state: () => {
    return {
      _roomInfo: {} as RoomInfo,
      _userCards: [] as CardInfo[],
      _selectCards: new Set() as Set<number>
    }
  },
  getters: {
    roomId: (state) => state._roomInfo.roomId,
    roomName: (state) => state._roomInfo.roomName,
    players: (state) => state._roomInfo.players,
    owner: (state) => state._roomInfo.owner,
    userCards: (state) => state._userCards,
    roomCode: (state) => state._roomInfo.roomCode,
    gameCards: (state) => state._roomInfo.gameCards,
    order:(state)=>state._roomInfo.order,
    startTime:(state)=>state._roomInfo.startTime,
    endTime:(state)=>state._roomInfo.endTime,
    winnerOrder:(state)=>state._roomInfo.winnerOrder,
    lastCard:(state)=>state._roomInfo.lastCard,
    selectCards: (state)=>state._selectCards
  },
  actions: {
    setRoomInfo(roomInfo: RoomInfo) {
      this._roomInfo = roomInfo
    },
    setRoomInfoProp<T extends keyof RoomInfo>(key: T,val: RoomInfo[T]){
      this._roomInfo[key] = val;
    },
    updatePlayers(players: PlayerInfo[]) {
      this._roomInfo.players = players
    },
    setUserCards(cards:CardInfo[]){
      this._userCards = cards
    },
    selectCard (i: number) {
      if (i < 0 || i >= this._userCards.length) return;
      this._selectCards.add(i);
    },
    unSelectCard(i: number){
      if (i < 0 || i >= this._userCards.length) return;
      this._selectCards.delete(i)
    },
    clearSelectCards(){
      this._selectCards = new Set()
    },
    cleanRoom(router:Router) {
      router.push('/')
      this._userCards = [];
      this._roomInfo = {} as RoomInfo;
    }
  },
})
