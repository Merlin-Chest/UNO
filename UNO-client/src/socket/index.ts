// import { io, Socket } from "socket.io-client";
// import type { ClientToServerEvents, ServerToClientEvents } from "~/types/server";
// import config from "~/configs/socket";
import { eventBus } from '~/store/socket';
import { useNotify } from '../composables/main';
// const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

const ws = new WebSocket('ws://localhost:3000')

ws.addEventListener('open', function open() {

});

ws.addEventListener<'message'>('message', function incoming(res: MessageEvent<string>) {
  try {
    const { message, data, type } = JSON.parse(res.data)
    if (message) {
      useNotify(message)
    }
    eventBus.emit(type, data)
  } catch (err) {
    console.error('发生错误:', err)
  }
});

export default ws;

