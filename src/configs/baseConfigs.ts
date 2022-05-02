import { genArr0To9, genArr1To9 } from '~/utils'

const colorList = ['#FF6666', '#99CC66', '#99CCFF', '#FFCC33']

export const cardInfomation = () => [
  ...[...[...genArr0To9, ...genArr1To9].map((i) => {
    return {
      type: `number-${i}`,
      icon: `${i}`,
    }
  }),
  ...new Array(2).fill([{
    type: 'exchange',
    icon: 'arrow-right-arrow-left',
  },
  {
    type: 'ban',
    icon: 'ban',
  },

  {
    type: 'add-2',
    icon: 'clone',
  }]).flat()].map((item) => {
    return colorList.map((color) => {
      return {
        ...item,
        color,
      }
    })
  }).flat(),
  ...new Array(4).fill({
    type: 'add-4',
    icon: 'dice-d20',
    color: '#9a9a9a',
  }),
  ...new Array(4).fill({
    type: 'palette',
    icon: 'palette',
    color: '#9a9a9a',
  }),
]

