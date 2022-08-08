 const genArr1To9 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 const genArr0To9 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
//  const genFuncCard1 = ['exchange', 'add-2', 'ban'];
//  const genFuncCard2 = ['palette', 'add-4'];


export const colorList :{
  [T in CardColor]:string
}= {
  '#FF6666':'红色' ,'#99CC66':'绿色', '#99CCFF':'蓝色', '#FFCC33':'黄色'
}

export const cardInfomation = ():CardInfo[] => [
  ...[...[...genArr0To9, ...genArr1To9].map((i) => {
    return {
      type: `number-${i}`,
      icon: `fa6-solid:${i}`,
    }
  }),
  ...new Array(2).fill([{
    type: 'exchange',
    icon: 'fa6-solid:arrow-right-arrow-left',
  },
  {
    type: 'ban',
    icon: 'fa6-solid:ban',
  },

  {
    type: 'add-2',
    icon: 'fa6-solid:clone',
  }]).flat()].map((item) => {
    return Object.keys(colorList).map((color) => {
      return {
        ...item,
        color,
      }
    })
  }).flat(),
  ...new Array(4).fill({
    type: 'add-4',
    icon: 'fa6-solid:bahai',
    color: '#9a9a9a',
  }),
  ...new Array(4).fill({
    type: 'palette',
    icon: 'fa6-solid:palette',
    color: '#9a9a9a',
  }),
].map((item)=>{
  return{
    ...item,
    cardId:Math.random()*10000
  }
})

export const InitCardNum = 7
