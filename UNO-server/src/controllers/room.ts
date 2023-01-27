import type { RoomInfo } from 'types/room';
import { emitGameOver, emitToNextTurn } from '../services/game';
import type { ClientRoomEvents, ClientToServerEvents, RespondFromServer } from 'types/server';
import { createPlayer, createRoom, emitAllPlayers, roomCollection, updatePlayerListToPlayers, userInWhichRoom } from '../services/room';
import { randomCoding } from '../utils';
import { deleteKey, get, set } from '../utils/customCRUD';
import WebSocket from 'ws';

const roomControllers: Pick<ClientToServerEvents, ClientRoomEvents> = {
  CREATE_ROOM: async (data, ws) => {
    const code = randomCoding();
    let roomInfo: RoomInfo;
    set(roomCollection, code, (roomInfo = createRoom(data, ws, code)));
    send(ws, {
      message: '房间创建成功',
      data: roomInfo,
      type: 'RES_CREATE_ROOM',
    });
  },
  JOIN_ROOM: async (data, ws, wss) => {
    const { roomCode, userInfo } = data;
    const roomInfo = get(roomCollection, roomCode)

    if (!roomInfo) {
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_JOIN_ROOM',
      })
    }
    if (roomInfo.status === 'GAMING') {
      return send(ws, {
        message: '该房间已开始游戏',
        data: null,
        type: 'RES_JOIN_ROOM',
      })
    } else if (roomInfo.status === 'END') {
      return send(ws, {
        message: '该房间游戏已结束',
        data: null,
        type: 'RES_JOIN_ROOM',
      })
    } else {
      roomInfo.players.push(createPlayer(userInfo, ws));
      // 触发其他客户端更新玩家列表
      updatePlayerListToPlayers(roomCode, roomInfo.players, `玩家 ${userInfo.name} 进入`);
      return send(ws, {
        message: '加入房间成功',
        data: roomInfo,
        type: 'RES_JOIN_ROOM',
      });
    }
  },
  LEAVE_ROOM: async (data, ws, wss) => {
    const { roomCode, userInfo } = data
    const roomInfo = get(roomCollection, roomCode);
    if (roomInfo) {
      const idx = leaveRoom(ws, roomInfo);
      if (roomInfo.players.length < 2) {
        // 如果当前只剩1人，直接结束游戏
        emitGameOver(roomInfo, roomCode)
      } else {
        updatePlayerListToPlayers(roomCode, roomInfo.players, `玩家 ${userInfo.name} 离开房间`)
        // 如果轮到该玩家发牌,重新进入下一轮
        if (roomInfo.status === 'GAMING' && idx === roomInfo.order) {
          emitToNextTurn(roomCode, roomInfo)
        }
      }
      send(ws, {
        message: '您已离开房间',
        data: null,
        type: 'RES_LEAVE_ROOM'
      })
    }
    send(ws, {
      message: '房间不存在',
      data: {},
      type: 'RES_LEAVE_ROOM'
    })
  },
  DISSOLVE_ROOM: async (data, ws) => {
    const code = data;
    dissolveRoom(code);
    emitAllPlayers(code, {
      message: '房间已解散',
      data: null,
      type: 'RES_DISSOLVE_ROOM'
    })
    send(ws, {
      message: '房间已解散',
      data: null,
      type: 'RES_DISSOLVE_ROOM'
    })
  }
};
export default roomControllers;



function dissolveRoom(code: string) {
  deleteKey(roomCollection, code)
  roomCollection.delete(code);
}

/**
 * 离开房间
 * @param ws 玩家websocket实例
 * @param roomInfo 房间信息
 * @returns 返回玩家原来在队伍的位置
 */
function leaveRoom(ws: WebSocket.WebSocket, roomInfo: RoomInfo) {
  const idx = roomInfo.players.findIndex((item) => item.socketInstance === ws)
  roomInfo.players.splice(idx, 1)
  userInWhichRoom.delete(ws)
  return idx;
}

export function send(sc: WebSocket.WebSocket, data: RespondFromServer) {
  try {
    const stringify = JSON.stringify(data, (key, value) => {
      // 不传递ws实例对象
      if (key === 'socketInstance') {
        return undefined;
      }
      return value
    });
    sc.send(stringify)
  } catch (error) {
    console.error(error)
  }
}
