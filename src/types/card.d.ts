type ZeroToNine = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
type OneToNine = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
declare type RED = '#FF6666' 
declare type BLUE = '#99CCFF'
declare type YELLOW = '#FFCC33'
declare type GREEN = '#99CC66'

declare type CardColor = RED | BLUE | GREEN | YELLOW

type CardNumberType<T extends number> = `number-${T}`;
type CardOtherType = 'add-2' | 'add-4' | 'exchange' | 'palette' | 'ban'

declare interface CardInfo {
  icon: string,
  type: CardNumberType<ZeroToNine> | CardOtherType
  color:CardColor | string
}
