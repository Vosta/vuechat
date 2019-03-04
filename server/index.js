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

var currentConnections = [];
var activeUsersIds = [];

io.on("connection", function (socket) {
  currentConnections.push({
    socketId: socket.id
  });

  socket.on('disconnect', async () => {
    for (let i = 0; i < currentConnections.length; i++) {
      if (currentConnections[i].socketId === socket.id) {
        socket.broadcast.emit('contactStatusChanged', {id: currentConnections[i].userId, status: false});
        if(activeUsersIds.indexOf(currentConnections[i].userId) > -1){
          activeUsersIds.splice(activeUsersIds.indexOf(currentConnections[i].userId), 1);
        }
        currentConnections.splice(i, 1);
        break;
      };
    }
    console.log('User disconnected');
  });

  socket.on('userLoggedIn', (data) => {
    //let other sokckets know that this socket loged in
    for (let i of currentConnections.keys()) {
      if (currentConnections[i].socketId === socket.id) {
        currentConnections[i].userId = data.user._id;
        activeUsersIds.push(data.user._id);
        break;
      };
    }
    socket.broadcast.emit('contactStatusChanged', {id: data.user._id, status: true});
    //get active statuses of other sockets
    for (let i of data.user.contacts.keys()) {
      if (activeUsersIds.indexOf(data.contacts[i]._id) > -1) {
        data.contacts[i].active = true;
      } else {
        data.contacts[i].active = false;
      };
    }
    socket.emit('ActiveUsers', data);
  });

  socket.on('userLoggedOut', (user) => {
    //combine this with user disconnect
    for (let i of currentConnections.keys()) {
      if (currentConnections[i].userId === user._id) {
        socket.broadcast.emit('contactStatusChanged', {id: user._id, status: false});
        delete currentConnections[i].userId; //delete userId key from currentConnections
        activeUsersIds.splice(activeUsersIds.indexOf(user._id), 1);
        break;
      };
    }
  })

  socket.on('JOIN_ROOM', (data) => {
    let room = data.chat;
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.join(room);
    socket.room = room;
    console.info(socket.id + ' joined room ' + room, socket.room);
  });


  socket.on('message', (data) => {
    let room = data.chatId;
    console.log('sending message to room', room)
    socket.broadcast.to(room).emit('messageSent', {
      message: data.message
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
