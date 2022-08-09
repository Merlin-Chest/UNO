import { defineStore } from "pinia";

const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: '',
      name: ''
    }
  },
  actions: {
    setUserInfo(userInfo: UserInfo) {
      const { id, name } = userInfo
      this.id = id;
      this.name = name
    },
    getUserInfo() {
      return {
        id: this.id,
        name: this.name
      }
    }
  }
})

export default useUserStore
