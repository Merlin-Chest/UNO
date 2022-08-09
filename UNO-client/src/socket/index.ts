import { io, Socket } from "socket.io-client";
import { useNotify } from "~/composables";
import type { ClientToServerEvents, ServerToClientEvents } from "~/types/server";
// import config from "~/configs/socket";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on('connect', () => {
  useNotify('欢迎进入uno世界！')
})

export default socket;

