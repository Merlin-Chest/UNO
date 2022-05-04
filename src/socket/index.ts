import { io, Socket } from "socket.io-client";
// import config from "~/configs/socket";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

socket.on('connect', () => {
  console.log('连接成功！')
  const engine = socket.io.engine;
  console.log(engine.transport.name); // in most cases, prints "polling"

  engine.on("message", () => {
    // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    console.log(engine.transport.name); // in most cases, prints "websocket"
  });
})

export default socket;
