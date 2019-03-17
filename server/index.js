const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)

const auth = require('./routes/auth/index');
const user = require('./routes/user/index');
const verify = require('./middlewears/verify');

const contactService = require('./models/contact.service');
const chatService = require('./models/chat.service');
const searchService = require('./models/search.service');

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

app.use('/auth', auth);
// Setting up Socket.io
const connections = {};

io.on("connection", function (socket) {
  //connections={}
  //temporary functions
  function userDisconnect() {
    if (connections[socket.id]) {
      const user = connections[socket.id];
      socket.broadcast.emit('CONTACT_STATUS', { id: user.userId, status: false });
      delete connections[socket.id];
      console.log(connections);
      console.log('User disconnected');
    }
  }
  //find a solution to combine these
  socket.on('disconnect', () => {
    userDisconnect();

  });
  socket.on('userDisconnect', () => {
    userDisconnect();
  });
  socket.on('GET_USER_DATA', async (token) => {
    let userData = await verify(token);
    connections[socket.id] = {
      userId: userData._id,
      username: userData.username
    }
    console.log(connections);
    userData = await contactService.refreshContacts(userData);
    userData = await chatService.refreshChats(userData);
    userData.contactsData.filter(contact => {
      Object.keys(connections).find(key => {
        if (connections[key].userId == contact._id) {
          return contact.active = true;
        } else {
          return contact.active = false;
        };
      });
    })

    socket.emit('USER', userData);
    socket.broadcast.emit('CONTACT_STATUS', { id: userData._id, status: true });
  });

  socket.on('JOIN_ROOM', async (data) => {
    const user = connections[socket.id];
    let chatData;
    let chatId;
    //if the chat is clicked from the contact section (no chatId)
    if (data.direct) {
      const participents = {
        userId: user.userId,
        contactId: data.chatData.contactId
      }
      chatData = await chatService.getDirectChat(participents);
    } else {
      chatData = await chatService.getChat(data.chatData._id);
    }
    chatId = chatData.chatId;
    const room = chatId;
    //leave the current room if it exists
    if (socket.room) {
      leaveRoom();
    }
    //join the room
    socket.join(room);
    socket.room = room;
    socket.emit('CHAT_DATA', chatData);
    //socket.broadcast.to(room).emit('USER_CHAT_STATUS', `${user.username} entered the chat`);
    console.info(socket.id + ' joined room ' + room);
  });

  socket.on('SEND_MESSAGE', async (data) => {
    const room = data.chatId;
    chatService.saveMessage(data);
    io.sockets.in(room).emit('MESSAGE', {
      message: data.message,
      chatId: room
    });
  });

  socket.on('addContact', (data) => {
    contactId = data.contactId.toString();
    console.log(contactId)
    Object.keys(connections).find(key => {
      if (connections[key].userId === contactId) {
        console.log('YES')
        const currentUser = connections[socket.id].userId;
        io.to(key).emit('contactRequest', currentUser);
        return;
      }
    });
  });
  socket.on('SEARCH', async (data) => {
    try {
      const result = await searchService(data);
      socket.emit('SEARCH_DATA', result)
    } catch (err) {
      console.log(err)
    }

  })
});
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
