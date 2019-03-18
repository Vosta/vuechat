const socketio = require('socket.io');
const verify = require('../middlewears/verify');
const contactService = require('../models/contact.service');
const chatService = require('../models/chat.service');
const searchService = require('../models/search.service');

module.exports.listen = function (server) {
  const connections = {};
  const io = socketio.listen(server);

  io.on("connection", socket => {
    //connections={}
    //temporary functions
    function userDisconnect() {
      if (connections[socket.id]) {
        const user = connections[socket.id];
        socket.broadcast.emit('CONTACT_STATUS', { id: user.userId, status: false });
        delete connections[socket.id];
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
    socket.on('GET_USER_DATA', async token => {
      try {
        let userData = await verify(token);
        connections[socket.id] = {
          userId: userData._id,
          username: userData.username
        }
        userData = await contactService.refreshContacts(userData);
        userData = await chatService.refreshChats(userData);
        userData.contactsData.filter(contact => {
          Object.keys(connections).find(key => {
            if (connections[key].userId == contact._id) {
              return contact.active = true;
            }
            return contact.active = false;
          });
        })
        socket.emit('USER', userData);
        socket.broadcast.emit('CONTACT_STATUS', { id: userData._id, status: true });
      } catch (error) {
        console.log(error)
      }
    });

    socket.on('JOIN_ROOM', async data => {
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

    socket.on('SEND_MESSAGE', async data => {
      const room = data.chatId;
      chatService.saveMessage(data);
      io.sockets.in(room).emit('MESSAGE', {
        message: data.message,
        chatId: room
      });
    });

    socket.on('CONTACT_REQUEST', async contactId => {
      const currentUserId = connections[socket.id].userId;
      const response = await contactService.addContact(currentUserId, contactId);
      console.log(response)
      socket.emit('PENDING_CONTACT', response.contactPending);
      Object.keys(connections).find(socketId => {
        if (connections[socketId].userId == contactId) {
          io.to(socketId).emit('CONTACT_REQUEST', response.contactRequest);
          return;
        }
      });
    });
    socket.on('ACCEPT_CONTACT_REQUEST', async contactId => {
      const currentUserId = connections[socket.id].userId;
      const response = await contactService.acceptContact(currentUserId, contactId);
      Object.keys(connections).find(socketId => {
        if (connections[socketId].userId == contactId) {
          response.contact.active = true;
          io.to(socketId).emit('ADD_CONTACT', response.currentUser);
          return;
        }
      });
      socket.emit('ADD_CONTACT', response.contact);
    })
    socket.on('REMOVE_PENDING_REQUEST', async contactId => {
      try {
        const currentUserId = connections[socket.id].userId;
        await contactService.removeRequest(currentUserId, contactId);
        socket.emit('REMOVE_PENDING_REQUEST', contactId);
        //emit to contact socket that he was denied
      } catch (error){
        console.log(error)
      }
    })
    socket.on('REMOVE_CONTACT', async contactId => {
      const currentUserId = connections[socket.id].userId;
      await contactService.removeContact(currentUserId, contactId);
      socket.emit('REMOVE_CONTACT', contactId)
    })
    socket.on('SEARCH', async data => {
      try {
        const result = await searchService(data);
        socket.emit('SEARCH_DATA', result)
      } catch (err) {
        console.log(err)
      }

    })
  });
}
