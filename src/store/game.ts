import { defineStore } from 'pinia'
import { useCards } from '~/hooks/card'

export const useGameStore = defineStore('game', {
  state: () => {
    return {
      _gameCards: [] as CardProps[],
      _userCards: [] as CardProps[]
    }
  },
  getters: {
    userCards: (state) => state._userCards
  },
  actions: {
    getGameCards() {
      this._gameCards = useCards()
    },
    getNewCards(count: number = 1) {
      for (let i = 0; i < count; i++) {
        if (!this._gameCards || this._gameCards.length === 0) return;
        let card = this._gameCards.shift();
        this.addCard(card)
      }
    },
    addCard(card: CardProps | undefined) {
      if (!card) return;
      this._userCards.push(card)
    },
    removeCards(idxArr: number[]) {
      if (!idxArr || idxArr.length === 0) return []
      return this._userCards.reduce((prev, cur, i) => {
        if (idxArr.includes(i)) {
          prev.push(cur)
          this.userCards.splice(i,1);
        }
        return prev;
      }, [] as CardProps[])
    }
  },
})
