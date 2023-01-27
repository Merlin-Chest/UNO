import { emitAllPlayers, roomCollection, updateRoomInfoAtStart } from '../services/room';
import { get } from '../utils/customCRUD';
import { checkCards, dealCardsToPlayers, emitGameOver, emitToNextTurn, getNextOrder, getSpecifiedCards, updatePlayerCardInfo, isFunctionCard, changePlayerUNOStatus } from '../services/game';
import { TaskQueue } from '../utils';
import type { ClientGameEvents, ClientToServerEvents } from 'types/server';
import { colorList } from '../configs';
import { send } from './room';

const gameControllers: Pick<ClientToServerEvents, ClientGameEvents> = {
  START_GAME: (roomCode, ws) => {
    const roomInfo = get(roomCollection, roomCode)
    if (!roomInfo)
      // 房间code有误
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_START_GAME'
      })
    if (roomInfo.players.length < 2) {
      return send(ws, {
        message: '当前人数不足两人，无法开始游戏',
        data: null,
        type: 'RES_START_GAME'
      })
    }
    // 更新roomInfo
    updateRoomInfoAtStart(roomInfo)
    // 给所有玩家发牌
    dealCardsToPlayers(roomInfo)
    // 进入第一轮
    emitToNextTurn(roomCode, roomInfo);
    send(ws, {
      data: null,
      type: 'RES_START_GAME'
    })
  },
  OUT_OF_THE_CARD: async (data, ws) => {
    const { roomCode, cardsIndex } = data
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo)
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      })
    const player = roomInfo.players.find((item) => item.socketInstance === ws);
    if (!player)
      return send(ws, {
        message: '玩家不存在',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      })
    if (cardsIndex.length === 0)
      return send(ws, {
        message: '请选择要出的牌',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      })
    const lastCard = roomInfo.lastCard;
    // 新建任务队列
    const tasks = new TaskQueue();
    // 判断牌的类型，做出操作
    const stauts = checkCards(player.cards!, cardsIndex, lastCard, tasks, roomInfo, ws);
    if (!stauts) {
      // 检测不通过
      return send(ws, {
        message: '出牌不符合规则，请重新出牌',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      })
    }
    // 更新玩家信息
    updatePlayerCardInfo(player, cardsIndex, roomInfo)
    // 执行所有卡牌任务
    await tasks.exec()
    // 执行之后，反馈结果
    send(ws, {
      message: '出牌成功',
      data: player.cards,
      type: 'RES_OUT_OF_THE_CARD'
    })
    // 检查UNO状态，不通过，添加两张手牌
    if (cardsIndex.length === 1 && player.cards.length === 0 && player.uno === false) {
      player.cards!.push(...getSpecifiedCards(roomInfo.gameCards, 2))
      send(ws, {
        message: '请记得UNO！获得手牌2张',
        data: player.cards,
        type: 'RES_OUT_OF_THE_CARD'
      })
    }
    if (player.cards?.length === 0) {
      // 有玩家牌全部用完了，则应该结束游戏
      // 更新房间信息
      emitGameOver(roomInfo, roomCode);
      return send(ws, {
        message: '恭喜你赢得游戏',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      })
    } else {
      // 通知所有玩家进入下一轮，更新客户端信息
      emitToNextTurn(roomCode, roomInfo);
    }
  },
  GET_ONE_CARD: (roomCode, ws) => {
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo)
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_GET_ONE_CARD'
      })
    const player = roomInfo.players.find((item) => item.socketInstance === ws);
    if (!player)
      return send(ws, {
        message: '玩家不存在',
        data: null,
        type: 'RES_GET_ONE_CARD'
      })
    const card = getSpecifiedCards(roomInfo.gameCards, 1);
    player.cards?.push(...card)
    // 更新UNO状态
    if (player.cards.length > 1 && player.uno === true) {
      changePlayerUNOStatus(ws, player, false);
    }
    return send(ws, {
      data: {
        userCards: player.cards,
        card: card[0]
      },
      type: 'RES_GET_ONE_CARD'
    })
  },
  NEXT_TURN: (roomCode, ws) => {
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo) {
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_NEXT_TURN'
      })
    }
    // 通知所有玩家进入下一轮，更新客户端信息
    emitToNextTurn(roomCode, roomInfo);
  },
  SUBMIT_COLOR: (res, ws) => {
    const { color, roomCode } = res
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo) {
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_SUBMIT_COLOR'
      })
    }
    roomInfo!.lastCard!.color = color;
    // 更改房间颜色
    emitAllPlayers(roomCode, {
      message: '卡牌颜色更改为：' + colorList[color as CardColor],
      type: 'COLOR_IS_CHANGE',
      data: color
    })
    roomInfo!.order = getNextOrder(roomInfo!);
    // send(ws, {
    //   message: '卡牌颜色更改为：' + colorList[color as CardColor],
    //   data: null,
    //   type: 'RES_SUBMIT_COLOR'
    // });
  },
  UNO: (roomCode, ws, wss) => {
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo) {
      return send(ws, {
        message: '房间不存在',
        data: null,
        type: 'RES_UNO'
      })
    }
    const player = roomInfo.players.find((item) => item.socketInstance === ws);
    if (!player) {
      return send(ws, {
        message: '玩家不存在',
        data: null,
        type: 'RES_UNO'
      })
    }
    if (player.cards && (player.cards?.length >= 2 || isFunctionCard(player.cards[0]))) {
      // 不满足UNO条件：手牌数量大于等于2，或者最后一张是功能牌
      return send(ws, {
        message: '不符合UNO条件',
        data: null,
        type: 'RES_UNO'
      })
    }
    changePlayerUNOStatus(ws, player, true);
    emitAllPlayers(roomCode, {
      message: '玩家' + player.name + 'UNO!',
      type: 'RES_UNO',
      data: null
    })
  },
};

export default gameControllers;
