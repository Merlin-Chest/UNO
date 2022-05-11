import { io, Socket } from "socket.io-client";
import notify from "~/plugins/notification/notify";
import type { ClientToServerEvents, ServerToClientEvents } from "~/types/server";
// import config from "~/configs/socket";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on('connect', () => {
  notify({
    content:'欢迎进入uno世界！',
  })
  const engine = socket.io.engine;
  engine.on("message", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log('message')
  });
})

export default socket;
