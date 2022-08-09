import type { Controllers, ClientUserKeys, ServerType, SocketType } from '~/types/server';
import { createUser, userCollection } from '../services/user';
import { has, set } from '../utils/customCRUD';

const userControllers: Controllers<ClientUserKeys, SocketType, ServerType> = {
  CREATE_USER:async (args) => {
    const { id, name } = args as UserInfo;
    const key = (id + name);
    if (has(userCollection, key)) {
      return {
        message: '人员已存在，请重新输入昵称',
        data: false,
        type: 'RES_CREATE_USER',
      };
    }
    let userInfo;
    set(userCollection, key, userInfo = createUser(args));
    return {
      message: '玩家信息创建成功',
      data: userInfo,
      type: 'RES_CREATE_USER',
    };
  },
};

export default userControllers;
