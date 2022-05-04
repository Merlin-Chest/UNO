declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare type PlayerInfo = UserInfo

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCard: CardProps[];
  userCards: {
    [key: string]: CardProps[]
  };
  players:PlayerInfo[];
  order: string[];
  winnerOrder: string[];
  createTime: number;
  startTime: number;
  endTime: number;
}
