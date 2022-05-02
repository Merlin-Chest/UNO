type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type CardNumberType<T> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

declare interface CardProps {
  icon: string | 1 | 2,
  type: CardNumberType<zeroToNine> | CardOtherType
  color: string
}
