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
}

type GetDataTypeOfEventName<E extends keyof EToD> = EToD[E]

declare interface ClientToServerEvents {
  'CREATE_ROOM': ClientEventListenersCb<'CREATE_ROOM', GetDataTypeOfEventName<'CREATE_ROOM'>>
  'JOIN_ROOM': ClientEventListenersCb<'JOIN_ROOM', GetDataTypeOfEventName<'JOIN_ROOM'>>
  'CREATE_USER': ClientEventListenersCb<'CREATE_USER', GetDataTypeOfEventName<'CREATE_USER'>>
}

declare interface ServerToClientEvents {
  'RES_CREATE_ROOM': ServerEventListenersCb<'RES_CREATE_ROOM',  GetDataTypeOfEventName<'RES_CREATE_ROOM'>>
  'RES_CREATE_USER': ServerEventListenersCb<'RES_CREATE_USER', GetDataTypeOfEventName<'RES_CREATE_USER'>>
  'RES_JOIN_ROOM': ServerEventListenersCb<'RES_JOIN_ROOM', GetDataTypeOfEventName<'RES_JOIN_ROOM'>>
  'UPDATE_PLAYER_LIST': ServerEventListenersCb<'UPDATE_PLAYER_LIST', GetDataTypeOfEventName<'UPDATE_PLAYER_LIST'>>
}

declare type ClientToServerEventsKeys = keyof ClientToServerEvents
declare type ServerToClientEventsKeys = keyof ServerToClientEvents

type s<C> = C extends ClientToServerEventsKeys ? `RES_${C}` : ''

declare type Controllers<S, I> = {
  [T in ClientToServerEventsKeys]: (args: GetDataTypeOfEventName<T>, sc: S, io: I) => ServerDataType<s<T>, GetDataTypeOfEventName<s<T>>>
}

declare interface InterServerEvents { }
