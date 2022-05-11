declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare interface PlayerInfo extends UserInfo {
  socketId:string,
  lastCard:CardProps | null,
  cardNum:number,
  cards:CardProps[] | null
}

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCards: CardProps[];
  userCards: {
    [key: string]: CardProps[]
  };
  lastCard:CardProps | null;
  players:PlayerInfo[];
  order: number;
  status:'WAITING'|'GAMING'|'END'
  winnerOrder: PlayerInfo[];
  createTime: number;
  startTime: number;
  endTime: number;
}
