import { cardInfomation } from '~/configs/baseConfigs'

const shuffle = (arr: any[]) => {
  let len = arr.length; let random
  while (len !== 0) {
    random = (Math.random() * len--) >>> 0; // 无符号右移位运算符向下取整(注意这里必须加分号，否则报错)
    [arr[len], arr[random]] = [arr[random], arr[len]] // ES6的结构赋值实现变量互换
  }
  return arr
}

export const useCards = () => {
  return shuffle(cardInfomation())
}
