import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import { UserInfo, userMessageData } from '@shared/types';

import joinRoom from './socketListeners/joinRoom';
import disconnect from './socketListeners/disconnect';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Server is running');
});

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);

    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
        disconnect(io, socket)
    }); 

    socket.on('joinRoom', (userInfo: UserInfo) => {
        joinRoom(io, socket, userInfo)
    });

    socket.on('clientChatMessage', (req: userMessageData) => {
        io.to(req.UserInfo.roomId).emit('serverMessageEmit', {userName: req.UserInfo.userName, message: req.message});
    });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});