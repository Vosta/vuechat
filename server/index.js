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

var currentConnections = {};
var currentUserId = '';

io.on("connection", function (socket) {
  console.log('User Connected');

  socket.on('disconnect', async () => {
    console.log('User Disconnected');
    delete currentConnections[currentUserId];
  });

  socket.on('userLoggedIn', async (user) => {
    currentConnections[user._id] = { 
      username: user.username,
    }
    console.log(currentConnections)
    socket.broadcast.emit('activeUser', user);
  })

  socket.on('ADD_CONTACT', async (data) => {
    console.log(data);

  });

  socket.on('JOIN_ROOM', async (data) => {
    let room = data.chat;
    if (socket.room) {
      socket.leave(socket.room);
    }
    socket.join(room);
    socket.room = room;
    console.info(socket.id + ' joined room ' + room, socket.room);
  });


  socket.on('message', async (data) => {
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
