import { useCards } from "./game";
import WebSocket from "ws";
import { send } from "../controllers/room";
import type { PlayerInfo, RoomInfo } from "types/room";
import type { RespondFromServer } from "types/server";

export const userInWhichRoom = new WeakMap();
export const roomCollection = new Map<string, RoomInfo>();

export function joinRoom(room: Set<WebSocket.WebSocket>, sc: WebSocket.WebSocket) {
  room.add(sc);
  userInWhichRoom.set(sc, room);
}

export function createRoom(args: any, ws: WebSocket.WebSocket, code: string) {
  let { roomId, roomName, owner } = args;
  owner = createPlayer(owner, ws);
  // 创建房间
  let playerSockets = new Set<WebSocket.WebSocket>();
  joinRoom(playerSockets, ws);
  const newLocal: RoomInfo = {
    roomId,
    roomName,
    owner,
    roomCode: code,
    players: [],
    gameCards: [],
    userCards: {},
    order: -1,
    status: 'WAITING',
    lastCard: null,
    winnerOrder: [],
    createTime: Date.now(),
    startTime: -1,
    endTime: -1,
    accumulation: 0,
    playOrder: 1
  };
  newLocal.players.push(owner);
  return newLocal;
}

// 创建玩家
export function createPlayer(userInfo: UserInfo, socketInstance: WebSocket.WebSocket): PlayerInfo {
  return {
    ...userInfo,
    socketInstance,
    cards: [],
    uno: false,
    lastCard: null
  }
}

// 通知指定房间的所有玩家
export function emitAllPlayers(roomCode: string, data: RespondFromServer) {
  const room = roomCollection.get(roomCode)
  if (room) {
    room.players.forEach((player) => {
      if (player.socketInstance.readyState === WebSocket.OPEN) {
        send(player.socketInstance, data)
      }
    })
  }
}

// 更新玩家列表
export function updatePlayerListToPlayers(roomCode: string, players: PlayerInfo[], message: string) {
  emitAllPlayers(roomCode, {
    message,
    data: players,
    type: 'UPDATE_PLAYER_LIST'
  })
}



// 开始游戏，更新房间信息
export function updateRoomInfoAtStart(roomInfo: RoomInfo) {
  // 生成游戏卡牌
  roomInfo.gameCards = useCards();
  roomInfo.players.forEach((item) => {
    item.lastCard = null
  })
  roomInfo.createTime = Date.now();
  roomInfo.status = 'GAMING'
}

// 游戏结束，更新房间信息
export function updateRoomInfoAtEnd(roomInfo: RoomInfo) {
  roomInfo.endTime = Date.now();
  roomInfo.winnerOrder = roomInfo.players.sort((a, b) => a.cards!.length - b.cards!.length);
  roomInfo.status = 'END'
}
