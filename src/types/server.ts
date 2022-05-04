declare interface dataType<T> {
  type: ServerToClientEventsKeys,
  data: T
  message?: string
}

declare type ServerToClientEvents = {
  [key in ServerToClientEventsKeys]: EventListenersCb
}

declare type EventListenersCb = (res: dataType<any>) => void


declare type ClientToServerEventsKeys = keyof ClientToServerEvents
declare type ServerToClientEventsKeys = `RES_${ClientToServerEventsKeys}`

declare interface ClientToServerEvents {
  CREATE_ROOM: (data: dataType<RoomData>) => void;
  CREATE_USER: (data: dataType<UserInfo>) => void;
}

declare interface InterServerEvents{}
