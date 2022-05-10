declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare interface PlayerInfo extends UserInfo {
  socketId:string,
  lastCard:CardProps | null,
  cardNum:number
}

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCards: CardProps[];
  userCards: {
    [key: string]: CardProps[]
  };
  players:PlayerInfo[];
  order: number;
  winnerOrder: string[];
  createTime: number;
  startTime: number;
  endTime: number;
}
