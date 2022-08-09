declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare interface PlayerInfo extends UserInfo {
  socketId:string,
  lastCard:CardInfo | null,
  cards:CardInfo[] | null
}

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCards: CardInfo[];
  userCards: {
    [key: string]: CardInfo[]
  };
  lastCard:CardInfo | null;
  players:PlayerInfo[];
  order: number;
  status:'WAITING'|'GAMING'|'END'
  winnerOrder: PlayerInfo[];
  createTime: number;
  startTime: number;
  endTime: number;
  playOrder: 1 | -1;
  accumulation:number
}
