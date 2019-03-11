const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);

const auth = require('./routes/auth/index');
const user = require('./routes/user/index');

app.use(volleyball);
app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'hi'
  });
});

//leads to auth/index.js
app.use('/auth', auth);
app.use('/user', user);

// Setting up Socket.io

const io = require('socket.io')(server);

var connections = {};

io.on("connection", function (socket) {
  //connections={}
  //temporary functions
  function userDisconnect() {
    if (connections[socket.id]) {
      let userId = connections[socket.id].userId;
      socket.broadcast.emit('contactStatusChanged', { id: userId, status: false });
      delete connections[socket.id];
      console.log('User disconnected');
    }
  }
  function leaveRoom() {
    const user = connections[socket.id];
    socket.broadcast.to(socket.room).emit('userEnteredOrLeft', `${user.username} left the chat`);
    socket.leave(socket.room);
  }
  //find a solution to combine these
  socket.on('disconnect', () => {
    userDisconnect();
  });
  socket.on('userDisconnect', () => {
    userDisconnect();
  })

  socket.on('userLoggedIn', (data) => {
    //put conntact in activeConnections array
    connections[socket.id] = {
      userId: data.user._id,
      username: data.user.username
    }
    socket.broadcast.emit('contactStatusChanged', { id: data.user._id, status: true });
    //get active statuses of other sockets
    data.contacts.filter(contact => {
      Object.keys(connections).find(key => {
        if (connections[key].userId === contact._id) {
          return contact.active = true;
        } else {
          return contact.active = false;
        };
      });
    })
    console.log(connections);
    socket.emit('ActiveUsers', data);
  });


  socket.on('JOIN_ROOM', (data) => {
    const room = data.chatId;
    //leave the current room if it exists
    if (socket.room) {
      leaveRoom(); 
    }
    //join the room
    socket.join(room);
    socket.room = room;
    socket.broadcast.to(room).emit('userEnteredOrLeft', `${data.user.username} entered the chat`);
    console.info(socket.id + ' joined room ' + room, socket.room);
  });
  
  socket.on('message', (data) => {
    const room = data.chatId;
    socket.broadcast.to(room).emit('recieveMessage', {
      message: data.message,
      chatId: room
    });
  });

})

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log('Listening on port', port);
});
