import type { ServerDataType, ServerKeys, ServerType, SocketType } from "~/types/server";
import { useCards } from "./game";

export const roomCollection = new Map<string, RoomInfo>();

export function createRoom(args: any, sc: SocketType, code: string): any {
  let { roomId, roomName, owner } = args;
  owner = createPlayer(owner,sc.id);
  const newLocal: RoomInfo = {
    roomId,
    roomName,
    owner,
    roomCode: code,
    players: [],
    gameCards: [],
    userCards: {},
    order: -1,
    status:'WAITING',
    lastCard:null,
    winnerOrder: [],
    createTime: Date.now(),
    startTime: -1,
    endTime: -1,
    accumulation:0,
    playOrder:1
  };
  newLocal.players.push(owner);
  return newLocal;
}

// 创建玩家
export function createPlayer(userInfo: UserInfo, socketId: string): PlayerInfo {
  return {
    ...userInfo,
    socketId,
    cards:null,
    lastCard: null
  }
}

// 通知指定房间的所有玩家
export function emitAllPlayers(io: ServerType, roomCode: string, event: ServerKeys, data: ServerDataType<typeof event, any>) {
  io.sockets.in(roomCode).emit(event, data as any)
}

// 更新玩家列表
export function updatePlayerListToPlayers(io: ServerType, roomCode: string, players: PlayerInfo[], message: string) {
  emitAllPlayers(io, roomCode, 'UPDATE_PLAYER_LIST', {
    message,
    data: players,
    type: 'UPDATE_PLAYER_LIST'
  })
}



// 开始游戏，更新房间信息
export function updateRoomInfoAtStart(roomInfo:RoomInfo){
    // 生成游戏卡牌
    roomInfo.gameCards = useCards();
    roomInfo.players.forEach((item)=>{
      item.lastCard = null
    })
    roomInfo.createTime = Date.now();
    roomInfo.status='GAMING'
}

// 游戏结束，更新房间信息
export function updateRoomInfoAtEnd(roomInfo:RoomInfo){
  roomInfo.endTime = Date.now();
  roomInfo.winnerOrder = roomInfo.players.sort((a,b)=>a.cards!.length - b.cards!.length);
  roomInfo.status = 'END'
}
