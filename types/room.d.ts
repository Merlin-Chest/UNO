import type { CardProps } from "./card";
import { UserInfo } from "./user";

declare interface RoomData {
  roomId: string;
  roomName: string;
  owner: PlayerInfo;
}

declare type PlayerInfo = UserInfo

declare type RoomInfo = RoomData & {
  roomCode:string;
  gameCards: CardProps[];
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
