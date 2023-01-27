import type { RoomInfo, PlayerInfo } from "types/room";
import { cardInfomation, InitCardNum, FUNCTION_CARD_TYPE } from '../configs/card';
import { shuffle, TaskQueue } from "../utils";

import { emitAllPlayers, updateRoomInfoAtEnd } from "./room";
import WebSocket from 'ws';
import { send } from '../controllers/room';
import { eventBus } from "../index";
import gameControllers from '../controllers/game';

// 生成游戏卡牌
export const useCards = () => {
  return shuffle(cardInfomation())
}

// 获取指定数量的牌
export function getSpecifiedCards(cards: CardInfo[], num: number) {
  let res = [];
  for (let i = 0; i < num; i++) {
    if (cards.length < num) {
      // 牌不够了，补牌
      cards = cards.concat(useCards());
    }
    let card = cards.shift();
    res.push(card);
  }
  return res as CardInfo[];
}

// 给指定玩家发指定数量的牌
export function emitDealCardsToPlayer(socketInstance: WebSocket.WebSocket, newPlayerCards: CardInfo[], num: number) {
  send(socketInstance, {
    message: `获得卡牌 ${num} 张`,
    data: newPlayerCards,
    type: 'RES_DEAL_CARDS'
  })
}

// 游戏开始，给所有玩家发牌
export function dealCardsToPlayers(roomInfo: RoomInfo) {
  for (const player of roomInfo.players) {
    const userCards = (player.cards = getSpecifiedCards(roomInfo.gameCards, InitCardNum))
    send(player.socketInstance, {
      message: '游戏开始啦',
      data: {
        roomInfo,
        userCards
      },
      type: 'GAME_IS_START'
    })
  }
}

// 更新玩家卡牌信息
export function updatePlayerCardInfo(player: PlayerInfo, cardsIndex: number[], roomInfo: RoomInfo) {
  cardsIndex.forEach((i) => {
    const deleteCard = player.cards?.splice(i, 1);
    player.lastCard = { ...deleteCard![0] };
    roomInfo.lastCard = { ...deleteCard![0] };
  })
  return player.cards;
}

// 通知玩家进入下一轮
export function emitToNextTurn(roomCode: string, roomInfo: RoomInfo) {
  roomInfo.order = getNextOrder(roomInfo);
  const nextPlayer = roomInfo.players.find((_, i) => i === roomInfo.order);
  if (nextPlayer) {
    emitAllPlayers(roomCode, {
      message: `轮到玩家${nextPlayer.name}出牌`,
      type: 'NEXT_TURN',
      data: {
        players: roomInfo.players,
        lastCard: roomInfo.lastCard,
        order: roomInfo.order
      }
    })
  }
}

// 通知玩家游戏结束
export function emitGameOver(roomInfo: RoomInfo, roomCode: string) {
  updateRoomInfoAtEnd(roomInfo);
  // 通知玩家游戏结束
  emitAllPlayers(roomCode, {
    type: 'GAME_IS_OVER',
    message: '游戏结束',
    data: {
      winnerOrder: roomInfo.winnerOrder,
      endTime: roomInfo.endTime
    }
  });
}

// 检测玩家卡牌
export function checkCards(cards: CardInfo[], cardsIndex: number[], lastCard: CardInfo | null, tasks: TaskQueue, roomInfo: RoomInfo, sc: WebSocket.WebSocket): boolean {
  for (let i = 0; i < cardsIndex.length; i++) {
    const target = cards[cardsIndex[i]];
    if (
      // 出牌不规范
      (!checkCard(target, lastCard)) ||
      // 出完全部手牌，且其中包含功能牌，不符合“功能牌不能最后出”
      (cards.length === cardsIndex.length && isFunctionCard(target))
    ) {
      return false;
    } else {
      tasks.addTask(handleCardByType(target, roomInfo, sc));
    }
  }
  return true
}

// 检查单张卡牌
function checkCard(target: CardInfo, lastCard: CardInfo | null): boolean {
  if (!lastCard || isUniversalCard(target)) return true;
  return isSameColor(target, lastCard) || isSameType(target, lastCard);
}

/**
 * 是否相同颜色
 * @param target 目标手牌
 * @param lastCard 上一次更新的手牌
 * @returns boolean
 */
function isSameColor(target: CardInfo, lastCard: CardInfo) {
  return target.color === lastCard.color
}

/**
 * 是否相同类型
 * @param target 目标手牌
 * @param lastCard 上一次更新的手牌
 * @returns boolean
 */
function isSameType(target: CardInfo, lastCard: CardInfo) {
  return target.type === lastCard.type
}

/**
 * 是否万能牌（任何类型或颜色都可以出）
 * @param target 目标手牌
 * @returns boolean
 */
function isUniversalCard(target: CardInfo) {
  return target.type === 'palette' || target.type === 'add-4';
}

/**
 * 是否是功能牌
 * @param target 目标手牌
 * @returns boolean
 */
export function isFunctionCard(target: CardInfo) {
  return FUNCTION_CARD_TYPE.includes(target.type)
}


function handleCardByType(card: CardInfo, roomInfo: RoomInfo, ws: WebSocket.WebSocket): Function {
  let fn: Function;
  switch (card.type) {
    case 'exchange':
      fn = () => {
        roomInfo.playOrder = roomInfo.playOrder === 1 ? -1 : 1
        // TODO 给全部玩家发出通知
      }
      break;
    case 'ban':
      fn = () => {
        roomInfo.order = getNextOrder(roomInfo);
        // TODO 给对应玩家发出通知
      }
      break;
    case 'add-2':
      fn = () => {
        dealCardsToPlayer(roomInfo, 2);
        roomInfo.order = getNextOrder(roomInfo!);
      }
      break;
    case 'add-4':
      fn = () => {
        return new Promise<void>((resolve, reject) => {
          send(ws, {
            message: '请选择颜色',
            type: 'SELECT_COLOR',
            data: null
          })
          dealCardsToPlayer(roomInfo!, 4);
          eventBus.once('SUBMIT_COLOR', (data, ws, wss) => {
            gameControllers['SUBMIT_COLOR'](data, ws, wss);
            resolve();
          })
        })
      }
      break;
    case 'palette':
      fn = () => {
        return new Promise<void>((resolve, reject) => {
          send(ws, {
            message: '请选择颜色',
            type: 'SELECT_COLOR',
            data: null
          })
          eventBus.once('SUBMIT_COLOR', (data, ws, wss) => {
            gameControllers['SUBMIT_COLOR'](data, ws, wss);
            resolve();
          })
        })

      }
      break;
    default:
      fn = () => { }
      break;
  }
  return fn;
}

// 获取下一轮的玩家序号
export function getNextOrder(roomInfo: RoomInfo): number {
  return (roomInfo.order + roomInfo.playOrder + roomInfo.players.length) % roomInfo.players.length;
}

// 给下一个玩家添加牌
export function dealCardsToPlayer(roomInfo: RoomInfo, num: number) {
  const nextPlayer = roomInfo.players[getNextOrder(roomInfo)];
  nextPlayer.cards!.push(...getSpecifiedCards(roomInfo.gameCards, num))
  if (nextPlayer.cards.length > 1 && nextPlayer.uno === true) {
    changePlayerUNOStatus(nextPlayer.socketInstance, nextPlayer, false);
  }
  // 通知玩家
  emitDealCardsToPlayer(nextPlayer.socketInstance, nextPlayer.cards!, num);
}

export function changePlayerUNOStatus(ws: WebSocket.WebSocket, player: PlayerInfo, status: boolean) {
  player.uno = status;
  send(ws, {
    data: {
      playerId: player.id,
      playerName: player.name,
      unoStatus: status
    },
    type: 'CHANGE_UNO_STATUS'
  });
}

