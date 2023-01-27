import type { ClientToServerEvents, ClientUserEvents } from 'types/server';
import { createUser, userCollection } from '../services/user';
import { has, set } from '../utils/customCRUD';
import { send } from './room';

const userControllers: Pick<ClientToServerEvents, ClientUserEvents> = {
  CREATE_USER: (data, ws) => {
    const { id, name } = data;
    const key = (id + name);
    if (has(userCollection, key)) {
      return send(ws, {
        message: '人员已存在，请重新输入昵称',
        data: null,
        type: 'RES_CREATE_USER',
      })
    }
    let userInfo;
    set(userCollection, key, userInfo = createUser(data));
    send(ws, {
      message: '玩家信息创建成功',
      data: userInfo,
      type: 'RES_CREATE_USER',
    })
  },
};

export default userControllers;
