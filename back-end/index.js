const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

let db = require('./dataBase')
const joinRoom = require('./socketListeners/joinRoom')
const disconnect = require('./socketListeners/disconnect')

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
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

    socket.on('joinRoom', (userInfo) => {
        joinRoom(io, socket, userInfo)
    });

    socket.on('clientChatMessage', (req) => {
        io.to(req.userInfo.roomId).emit('serverMessageEmit', {userName: req.userInfo.userName, message: req.message});
    });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});