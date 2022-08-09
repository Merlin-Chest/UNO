import {  roomCollection, updateRoomInfoAtStart } from '../services/room';
import type { Controllers, ClientGameKeys, SocketType, ServerType } from '~/types/server';
import { get } from '../utils/customCRUD';
import { checkCards, dealCardsToPlayers, emitGameOver, emitToNextTurn, getSpecifiedCards, updatePlayerCardInfo } from '../services/game';
import { TaskQueue } from '../utils';
// import { colorList } from '../configs';

const gameControllers: Controllers<ClientGameKeys, SocketType, ServerType> = {
  START_GAME: async (roomCode: string, sc, io) => {
    const roomInfo = get(roomCollection, roomCode)
    if (!roomInfo)
      // 房间code有误
      return {
        message: '房间不存在',
        data: null,
        type: 'RES_START_GAME'
      }
    if (roomInfo.players.length < 2) {
      return {
        message: '当前人数不足两人，无法开始游戏',
        data: null,
        type: 'RES_START_GAME'
      }
    }
    // 更新roomInfo
    updateRoomInfoAtStart(roomInfo)
    // 给所有玩家发牌
    dealCardsToPlayers(io, roomCode, roomInfo)
    // 进入第一轮
    emitToNextTurn(io, roomCode, roomInfo);
    return{
      data: null,
      type: 'RES_START_GAME'
    }
  },
  OUT_OF_THE_CARD:async (data, sc, io) => {
    const { roomCode, cardsIndex } = data
    const roomInfo = get(roomCollection, roomCode);
    if (!roomInfo)
      return {
        message: '房间不存在',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
    const player = roomInfo.players.find((item) => item.socketId === sc.id);
    if (!player)
      return {
        message: '玩家不存在',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
      if(cardsIndex.length === 0) return{
        message: '请选择要出的牌',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
    const lastCard = roomInfo.lastCard;
    // 新建任务队列
    const tasks = new TaskQueue();
    // 判断牌的类型，做出操作
    const stauts = checkCards(player.cards!,cardsIndex,lastCard,tasks,roomInfo,io,sc);
    if(!stauts){
      // 检测不通过
      return {
        message: '出牌不符合规则，请重新出牌',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
    }
    // 更新玩家信息
    const newPlayerCards = updatePlayerCardInfo(player, cardsIndex, roomInfo)
    // 执行所有卡牌任务
    await tasks.exec()
    if (newPlayerCards?.length === 0) {
      // 有玩家牌全部用完了，则应该结束游戏
      // 更新房间信息
      emitGameOver(roomInfo, io, roomCode);
      return {
        message: '恭喜你赢得游戏',
        data: null,
        type: 'RES_OUT_OF_THE_CARD'
      }
    } else {
      // 通知所有玩家进入下一轮，更新客户端信息
      emitToNextTurn(io, roomCode, roomInfo);
      return {
        message: '出牌成功',
        data: newPlayerCards,
        type: 'RES_OUT_OF_THE_CARD'
      }
    }
  },
  'GET_ONE_CARD': async (roomCode,sc,io)=>{
    const roomInfo = get(roomCollection,roomCode);
    if(!roomInfo)
      return {
        message: '房间不存在',
        data: null,
        type: 'RES_GET_ONE_CARD'
      }
    const player = roomInfo.players.find((item) => item.socketId === sc.id);
    if (!player)
      return {
        message: '玩家不存在',
        data: null,
        type: 'RES_GET_ONE_CARD'
      }
    const card = getSpecifiedCards(roomInfo.gameCards,1);
    player.cards?.push(...card)
    return{
      data:{
        userCards:player.cards,
        card:card[0]
      },
      type:'RES_GET_ONE_CARD'
    }
  },
  'NEXT_TURN':async (roomCode,sc,io)=>{
    const roomInfo = get(roomCollection,roomCode);
    if(!roomInfo){
      return {
        message: '房间不存在',
        data: null,
        type: 'RES_NEXT_TURN'
      }
    }
    // 通知所有玩家进入下一轮，更新客户端信息
    emitToNextTurn(io, roomCode, roomInfo);
  },
};

export default gameControllers;




