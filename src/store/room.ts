import { defineStore } from 'pinia'
import type { RoomInfo, PlayerInfo } from 'types/room'

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
  },
  actions: {
    setRoomInfo(roomInfo: RoomInfo) {
      this._roomInfo = roomInfo
    },
    updatePlayers(players: PlayerInfo[]) {
      this._roomInfo.players = players
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
    cleanRoom() {
      this._userCards = [];
      this._roomInfo = {} as RoomInfo;
    }
  },
})
