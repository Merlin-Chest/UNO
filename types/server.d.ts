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

declare type ServerEventListenersCb<T, D> = (args: ServerDataType<T, D>) => void
declare type ClientEventListenersCb<T, D> = (args: ClientDataType<T, D>) => void

interface EToD {
  'CREATE_ROOM': RoomData
  'RES_CREATE_ROOM': RoomInfo
  'CREATE_USER': UserInfo
  'RES_CREATE_USER': UserInfo
  'JOIN_ROOM': { roomCode: string, playerInfo: PlayerInfo }
  'RES_JOIN_ROOM': RoomInfo | null
  'UPDATE_PLAYER_LIST': PlayerInfo[]
  'START_GAME':RoomInfo
}

type GetDataTypeOfEventName<E extends keyof EToD> = EToD[E]

declare type ClientRoomKeys = 'CREATE_ROOM' | 'JOIN_ROOM' | 'START_GAME'
declare type ClientUserKeys = 'CREATE_USER'

type addRESPrefix<C> = C extends ClientRoomKeys | ClientUserKeys ? `RES_${C}` : C

declare type ServerRoomKeys = addRESPrefix<ClientRoomKeys>
declare type ServerUserKeys = addRESPrefix<ClientUserKeys>

type ClientKeys = ClientRoomKeys | ClientUserKeys
type ServerKeys = ServerRoomKeys | ServerUserKeys

declare type Events<T> = {
  T: T extends ServerKeys
  ? ServerEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
  : T extends ClientKeys
  ? ClientEventListenersCb<T, T extends keyof EToD ? GetDataTypeOfEventName<T> : unknown>
  : unknown;
}

declare interface ClientToServerEvents extends Events<ClientKeys> {
}
declare interface ServerToClientEvents extends Events<ServerKeys> {
  'UPDATE_PLAYER_LIST': Events<'UPDATE_PLAYER_LIST'>
}

declare type Controllers<T extends keyof EToD, S, I> = {
  [K in T]: (args: K extends keyof EToD ? GetDataTypeOfEventName<K> : unknown, sc: S, io: I)
  => ServerDataType<addRESPrefix<K>,
  addRESPrefix<K> extends keyof EToD ? GetDataTypeOfEventName<addRESPrefix<K>> : unknown>
}

declare interface InterServerEvents {
}
