import type { ControllerKeys, Controllers, ServerType, SocketType } from '../types/server';
import gameControllers from './game';
import roomControllers from './room';
import userControllers from './user';

const controllers:Controllers<ControllerKeys, SocketType, ServerType> = {
  ...roomControllers,
  ...userControllers,
  ...gameControllers
};

export default controllers;
