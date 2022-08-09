import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import controllers from './controllers';
import type { ControllerKeys, ClientToServerEvents, InterServerEvents, ServerToClientEvents } from './types/server';

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents>(httpServer, {
  serveClient: false,
});

io.on('connection', (socket) => {
  console.log(`${socket.id}:连接成功`);
  Object.keys(controllers).forEach((key) => {
    socket.on(key as any, async (args: any) => {
      console.log(key, ':', args);
      if (args) {
        const { type, data } = args;
        const res = await controllers[type as ControllerKeys](data, socket, io);
        if (res) {
          console.log(res.type, ':', res);
          socket.emit(res.type as any, res as any);
        }
      }
    });
  });
  socket.on('error', (error) => {
    console.error('error:', error);
  });
  socket.on('disconnect', () => {
    console.log(`${socket.id}:断开连接`)
  })
});

httpServer.listen(3000);
