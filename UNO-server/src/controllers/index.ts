import type { ClientToServerEvents } from 'types/server';
import gameControllers from './game';
import roomControllers from './room';
import userControllers from './user';

const controllers: ClientToServerEvents = {
  ...roomControllers,
  ...userControllers,
  ...gameControllers
};

export default controllers;
