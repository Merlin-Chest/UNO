type zeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type oneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type CardNumberType<T extends number> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

declare interface CardProps {
  icon: string,
  type: CardNumberType<zeroToNine> | CardOtherType
  color: string
}
