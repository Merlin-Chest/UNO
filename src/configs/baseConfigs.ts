import { genArr0To9, genArr1To9 } from '~/styles/utils'

const colorList = ['#FF6666', '#99CC66', '#99CCFF', '#FFCC33']

export const cardInfomation = () => [
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
    return colorList.map((color) => {
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
]

