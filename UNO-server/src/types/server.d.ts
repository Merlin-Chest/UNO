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
  OUT_OF_THE_CARD:ClientEventListenersCb<'OUT_OF_THE_CARD',{
    roomCode:string,
    cardsIndex:number[]
  }>
  GET_ONE_CARD:ClientEventListenersCb<'GET_ONE_CARD',string>
  NEXT_TURN:ClientEventListenersCb<'NEXT_TURN',string>
  SUBMIT_COLOR:ClientEventListenersCb<'SUBMIT_COLOR',{
    color:CardColor,
    roomCode:string
  }>
}

declare interface ServerToClientEvents{
  RES_CREATE_ROOM:ServerEventListenersCb<'RES_CREATE_ROOM',RoomInfo>
  RES_CREATE_USER:ServerEventListenersCb<'RES_CREATE_USER',UserInfo>
  RES_JOIN_ROOM:ServerEventListenersCb<'RES_JOIN_ROOM', { roomCode: string, playerInfo: PlayerInfo }>
  RES_LEAVE_ROOM:ServerEventListenersCb<'RES_LEAVE_ROOM',null>
  RES_DISSOLVE_ROOM:ServerEventListenersCb<'RES_DISSOLVE_ROOM',null>
  UPDATE_PLAYER_LIST:ServerEventListenersCb<'UPDATE_PLAYER_LIST',PlayerInfo[]>
  UPDATE_ROOM_INFO:ServerEventListenersCb<'UPDATE_ROOM_INFO',RoomInfo>
  GAME_IS_START:ServerEventListenersCb<'GAME_IS_START',{roomInfo:RoomInfo,userCards:CardInfo[]}>
  RES_START_GAME:ServerEventListenersCb<'RES_START_GAME',{
    userCards:CardInfo[]
  }>
  DEAL_CARDS:ServerEventListenersCb<'RES_DEAL_CARDS',CardInfo[]>
  NEXT_TURN:ServerEventListenersCb<'NEXT_TURN',{
    players:PlayerInfo[],
    lastCard:CardInfo,
    order:number;
  }>
  RES_OUT_OF_THE_CARD:ServerEventListenersCb<'RES_OUT_OF_THE_CARD',CardInfo[] | null>
  GAME_IS_OVER:ServerEventListenersCb<'GAME_IS_OVER',{
    endTime:number,
    winnerOrder:PlayerInfo[]
  }>
  RES_GET_ONE_CARD:ServerEventListenersCb<'RES_OUT_OF_THE_CARD',{
    card:CardInfo;
    userCards:CardInfo[]
  }>
  RES_NEXT_TURN:ServerEventListenersCb<'RES_NEXT_TURN',null>
  SELECT_COLOR:ServerEventListenersCb<'SELECT_COLOR',null>
  COLOR_IS_CHANGE:ServerEventListenersCb<'SELECT_COLOR',CardColor>
}


declare type ServerEventListenersCb<T, D> = (args: ServerDataType<T, D>) => void
declare type ClientEventListenersCb<T, D> = (args: ClientDataType<T, D>) => void

type ClientKeys = keyof ClientToServerEvents
type ServerKeys = keyof ServerToClientEvents

declare type ClientRoomKeys = 'CREATE_ROOM'|'JOIN_ROOM'|'LEAVE_ROOM'|'DISSOLVE_ROOM'
declare type ClientUserKeys = 'CREATE_USER'
declare type ClientGameKeys = 'OUT_OF_THE_CARD'|'START_GAME'|'GET_ONE_CARD'|'NEXT_TURN'

// declare type Events<T> = {
//   T: T extends ServerKeys
//   ? ServerEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
//   : T extends ClientKeys
//   ? ClientEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
//   : unknown;
// }

declare type ControllerKeys = ClientRoomKeys | ClientUserKeys | ClientGameKeys

declare type Controllers<T extends keyof EToD, S, I> = {
  [K in T]: (args: K extends keyof ClientToServerEvents ? GetDataTypeOfEventName<K> : unknown, sc: S, io: I)
  => Promise<addRESPrefix<K> extends keyof ClientToServerEvents ? ServerDataType<addRESPrefix<K>,GetDataTypeOfEventName<addRESPrefix<K>>> : void>
}

declare interface InterServerEvents {
}


declare type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>
declare type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;
