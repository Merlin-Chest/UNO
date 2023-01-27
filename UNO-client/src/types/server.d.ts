import type { RoomData, RoomInfo, PlayerInfo } from "./room"
import type { UserInfo } from "./user"


declare interface RespondFromClient<T = ClientEvents, D = unknown> {
  type: T,
  data: D
  message?: string
}

declare interface RespondFromServer<T = ServerEvents, D = unknown> {
  type: T,
  data: D
  message?: string
}

type RoomCode = string

declare interface ClientToServerEvents {
  CREATE_ROOM: ClientEventListenersCb<'CREATE_ROOM', RoomData>
  CREATE_USER: ClientEventListenersCb<'CREATE_USER', UserInfo>
  JOIN_ROOM: ClientEventListenersCb<'JOIN_ROOM', UserInfo>
  LEAVE_ROOM: ClientEventListenersCb<'LEAVE_ROOM', {
    roomCode: string,
    userInfo: UserInfo
  }>
  DISSOLVE_ROOM: ClientEventListenersCb<'DISSOLVE_ROOM', RoomCode>
  START_GAME: ClientEventListenersCb<'START_GAME', RoomCode>
  OUT_OF_THE_CARD: ClientEventListenersCb<'OUT_OF_THE_CARD', {
    roomCode: RoomCode,
    cardsIndex: number[]
  }>
  GET_ONE_CARD: ClientEventListenersCb<'GET_ONE_CARD', RoomCode>
  NEXT_TURN: ClientEventListenersCb<'NEXT_TURN', RoomCode>
  SUBMIT_COLOR: ClientEventListenersCb<'SUBMIT_COLOR', {
    color: CardColor,
    roomCode: RoomCode
  }>
  UNO: ClientEventListenersCb<'UNO', RoomCode>
}

declare interface ServerToClientEvents {
  WELCOME: ClientEventListenersCb<'WELCOME', null>
  RES_CREATE_ROOM: ServerEventListenersCb<'RES_CREATE_ROOM', RoomInfo>
  RES_CREATE_USER: ServerEventListenersCb<'RES_CREATE_USER', UserInfo>
  RES_JOIN_ROOM: ServerEventListenersCb<'RES_JOIN_ROOM', { roomCode: string, playerInfo: PlayerInfo }>
  RES_LEAVE_ROOM: ServerEventListenersCb<'RES_LEAVE_ROOM', null>
  RES_DISSOLVE_ROOM: ServerEventListenersCb<'RES_DISSOLVE_ROOM', null>
  UPDATE_PLAYER_LIST: ServerEventListenersCb<'UPDATE_PLAYER_LIST', PlayerInfo[]>
  UPDATE_ROOM_INFO: ServerEventListenersCb<'UPDATE_ROOM_INFO', RoomInfo>
  GAME_IS_START: ServerEventListenersCb<'GAME_IS_START', { roomInfo: RoomInfo, userCards: CardInfo[] }>
  RES_START_GAME: ServerEventListenersCb<'RES_START_GAME', {
    userCards: CardInfo[]
  }>
  DEAL_CARDS: ServerEventListenersCb<'RES_DEAL_CARDS', CardInfo[]>
  NEXT_TURN: ServerEventListenersCb<'NEXT_TURN', {
    players: PlayerInfo[],
    lastCard: CardInfo,
    order: number;
  }>
  RES_OUT_OF_THE_CARD: ServerEventListenersCb<'RES_OUT_OF_THE_CARD', CardInfo[] | null>
  GAME_IS_OVER: ServerEventListenersCb<'GAME_IS_OVER', {
    endTime: number,
    winnerOrder: PlayerInfo[]
  }>
  RES_GET_ONE_CARD: ServerEventListenersCb<'RES_OUT_OF_THE_CARD', {
    card: CardInfo;
    userCards: CardInfo[]
  }>
  RES_NEXT_TURN: ServerEventListenersCb<'RES_NEXT_TURN', null>
  SELECT_COLOR: ServerEventListenersCb<'SELECT_COLOR', null>
  COLOR_IS_CHANGE: ServerEventListenersCb<'SELECT_COLOR', CardColor>
  RES_UNO: ServerEventListenersCb<'SELECT_COLOR', null>
  CHANGE_UNO_STATUS: ServerEventListenersCb<'SELECT_COLOR', {
    playerId: string,
    playerName: string,
    unoStatus: boolean
  }>
}


declare type ServerEventListenersCb<T, D> = (args: RespondFromClient<T, D>) => void
declare type ClientEventListenersCb<T, D> = (args: D, ws: WebSocket.WebSocket, wss: WebSocket.Server<WebSocket.WebSocket>) => void

declare type ClientRoomEvents = 'CREATE_ROOM' | 'JOIN_ROOM' | 'LEAVE_ROOM' | 'DISSOLVE_ROOM'
declare type ClientUserEvents = 'CREATE_USER'
declare type ClientGameEvents = 'OUT_OF_THE_CARD' | 'START_GAME' | 'GET_ONE_CARD' | 'NEXT_TURN' | 'SUBMIT_COLOR' | 'UNO'

declare type ServerRoomEvents = 'RES_CREATE_ROOM' | 'RES_JOIN_ROOM' | 'RES_LEAVE_ROOM' | 'RES_DISSOLVE_ROOM'
declare type ServerUserEvents = 'RES_CREATE_USER'
declare type ServerRGameEvents = 'RES_SUBMIT_COLOR' | 'RES_DEAL_CARDS' | 'UPDATE_PLAYER_LIST' | 'UPDATE_ROOM_INFO' | 'GAME_IS_START' | 'RES_START_GAME' | 'DEAL_CARDS' | 'NEXT_TURN' | 'RES_OUT_OF_THE_CARD' | 'GAME_IS_OVER' | 'RES_GET_ONE_CARD' | 'RES_NEXT_TURN' | 'SELECT_COLOR' | 'COLOR_IS_CHANGE' | 'RES_UNO' | 'CHANGE_UNO_STATUS'



declare type ClientEvents = ClientRoomEvents | ClientUserEvents | ClientGameEvents
declare type ServerEvents = 'WELCOME' | ServerRoomEvents | ServerUserEvents | ServerRGameEvents

declare type Controllers<T extends keyof EToD, S, I> = {
  [K in T]: (args: K extends keyof ClientToServerEvents ? GetDataTypeOfEventName<K> : unknown, sc: S, io: I)
    => Promise<addRESPrefix<K> extends keyof ClientToServerEvents ? RespondFromClient<addRESPrefix<K>, GetDataTypeOfEventName<addRESPrefix<K>>> : void>
}

declare interface InterServerEvents {
}


declare type ServerType = Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>
declare type SocketType = Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents>;
