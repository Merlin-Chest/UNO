declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: UserInfo;
}

declare type RoomInfo = RoomData & {
  gameCard: CardProps[];
  userCards: {
    [key: string]: CardProps[]
  };
  order: string[];
  winnerOrder: string[];
  createTime: number;
  startTime: number;
  endTime: number;
}
