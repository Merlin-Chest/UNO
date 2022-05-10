import type { RoomData, RoomInfo, PlayerInfo } from "./room"
import type { UserInfo } from "./user"

declare interface ClientDataType<T, D> {
  type: T,
  data: D
  message?: string
}

declare interface ServerDataType<T, D> {
  type: T,
  data: D
  message?: string
}

declare interface ClientToServerEvents {
  CREATE_ROOM:ClientEventListenersCb<'CREATE_ROOM',RoomData>
  CREATE_USER:ClientEventListenersCb<'CREATE_USER',UserInfo>
  JOIN_ROOM:ClientEventListenersCb<'JOIN_ROOM',UserInfo>
  LEAVE_ROOM:ClientEventListenersCb<'LEAVE_ROOM',{
    roomCode:string,
    userInfo:UserInfo
  }>
  DISSOLVE_ROOM:ClientEventListenersCb<'DISSOLVE_ROOM',string>
  START_GAME:ClientEventListenersCb<'START_GAME',string>
}

declare interface ServerToClientEvents{
  RES_CREATE_ROOM:ServerEventListenersCb<'RES_CREATE_ROOM',RoomInfo>
  RES_CREATE_USER:ServerEventListenersCb<'RES_CREATE_USER',UserInfo>
  RES_JOIN_ROOM:ServerEventListenersCb<'RES_JOIN_ROOM', { roomCode: string, playerInfo: PlayerInfo }>
  RES_LEAVE_ROOM:ServerEventListenersCb<'RES_LEAVE_ROOM',null>
  RES_DISSOLVE_ROOM:ServerEventListenersCb<'RES_DISSOLVE_ROOM',null>
  UPDATE_PLAYER_LIST:ServerEventListenersCb<'UPDATE_PLAYER_LIST',PlayerInfo[]>
  UPDATE_ROOM_INFO:ServerEventListenersCb<'UPDATE_ROOM_INFO',RoomInfo>
  GAME_IS_START:ServerEventListenersCb<'GAME_IS_START',{roomInfo:RoomInfo,userCards:CardProps[]}>
  RES_START_GAME:ServerEventListenersCb<'RES_START_GAME',{
    userCards:CardProps[]
  }>
  DEAL_CARDS:ServerEventListenersCb<'RES_DEAL_CARDS',CardProps[]>
}


declare type ServerEventListenersCb<T, D> = (args: ServerDataType<T, D>) => void
declare type ClientEventListenersCb<T, D> = (args: ClientDataType<T, D>) => void

type ClientKeys = keyof ClientToServerEvents
type ServerKeys = keyof ServerToClientEvents

declare type ClientRoomKeys = 'CREATE_ROOM'|'JOIN_ROOM'|'START_GAME'|'LEAVE_ROOM'|'DISSOLVE_ROOM'
declare type ClientUserKeys = 'CREATE_USER'

// declare type Events<T> = {
//   T: T extends ServerKeys
//   ? ServerEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
//   : T extends ClientKeys
//   ? ClientEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
//   : unknown;
// }

declare type Controllers<T extends keyof EToD, S, I> = {
  [K in T]: (args: K extends keyof ClientToServerEvents ? GetDataTypeOfEventName<K> : unknown, sc: S, io: I)
  => ServerDataType<addRESPrefix<K>,
  addRESPrefix<K> extends keyof ClientToServerEvents ? GetDataTypeOfEventName<addRESPrefix<K>> : unknown>
}

declare interface InterServerEvents {
}
