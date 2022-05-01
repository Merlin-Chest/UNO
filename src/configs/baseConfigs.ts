const colorList = ['red', 'green', 'blue', 'yellow']

export const cardInfomation = [
  ...[...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
    return {
      type: `number-${i}`,
    }
  }),
  {
    type: 'exchange',
  },
  {
    type: 'ban',
  },

  {
    type: 'add-2',
  }].map((item) => {
    return colorList.map((color) => {
      return {
        ...item,
        color,
      }
    })
  }).flat(),
  {
    type: 'add-4',
    color: 'white',
  },
  {
    type: 'palette',
    color: 'white',
  },
]
