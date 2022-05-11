import { defineStore } from 'pinia'
import { Router } from 'vue-router';

export const useRoomStore = defineStore('game', {
  state: () => {
    return {
      _roomInfo: {} as RoomInfo,
      _userCards: [] as CardProps[],
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
    lastCard:(state)=>state._roomInfo.lastCard
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
    setUserCards(cards:CardProps[]){
      this._userCards = cards
    },
    addUserCards(cards: CardProps[] | undefined) {
      if (!cards) return;
      if (!Array.isArray(this._userCards))
        this._userCards = []
      for (const card of cards) {
        this._userCards.push(card)
      }
    },
    removeCard(idx: number) {
      if (idx < 0 || idx >= this._userCards.length) return -1;
      return this.userCards.splice(idx, 1)[0];
    },
    removeCards(idxArr: number[]) {
      if (!idxArr || idxArr.length === 0) return []
      return this._userCards.reduce((prev, cur, i) => {
        if (idxArr.includes(i)) {
          prev.push(cur)
          this.userCards.splice(i, 1);
        }
        return prev;
      }, [] as CardProps[])
    },
    cleanRoom(router:Router) {
      router.push('/')
      this._userCards = [];
      this._roomInfo = {} as RoomInfo;
    }
  },
})
