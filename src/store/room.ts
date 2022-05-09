import { defineStore } from 'pinia'
import type { RoomInfo, PlayerInfo } from 'types/room'

export const useRoomStore = defineStore('game', {
  state: () => {
    return {
      _roomInfo:{} as RoomInfo,
      _userCards: [] as CardProps[],
    }
  },
  getters: {
    roomId:(state)=>state._roomInfo.roomId,
    roomName:(state)=>state._roomInfo.roomName,
    players:(state)=>state._roomInfo.players,
    owner:(state)=>state._roomInfo.owner,
    userCards: (state) => state._userCards,
    roomCode:(state)=>state._roomInfo.roomCode,
    gameCard: (state)=>state._roomInfo.gameCard,
  },
  actions: {
    setRoomInfo(roomInfo:RoomInfo){
      this._roomInfo = roomInfo
    },
    updatePlayers(players:PlayerInfo[]){
      this._roomInfo.players = players
    },
    getNewCards(count: number = 1) {
      for (let i = 0; i < count; i++) {
        if (!this.gameCard || this.gameCard.length === 0) return;
        let card = this.gameCard.shift();
        this.addCard(card)
      }
    },
    addCard(card: CardProps | undefined) {
      if (!card) return;
      this._userCards.push(card)
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
    resetGameData() {
      this._userCards = [];
    }
  },
})
