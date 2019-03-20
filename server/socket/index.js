const socketio = require('socket.io');
const verify = require('../middlewears/verify');
const contactService = require('../services/contact.service');
const chatService = require('../services/chat.service');
const searchService = require('../services/search.service');
const socketFunctions = require('./socketFunctions');

module.exports.listen = function (server) {
  const connections = {};
  const io = socketio.listen(server);
  
  io.on("connection", socket => {
    //remove user from active users on log out and on application close
    for (const event of ['disconnect', 'userDisconnect']) {
      socket.on(event, () => {
        socketFunctions.userDisconnect(socket, connections);
      })
    }
    socket.on('GET_USER_DATA', async token => {
      try {
        //verify users token
        let userData = await verify(token);
        //add user to active users
        connections[socket.id] = {
          userId: userData._id,
          username: userData.username
        }
        //fill users data
        userData = await contactService.refreshContacts(userData);
        userData = await chatService.refreshChats(userData);
        //seperate active users in users contacts
        userData.contactsData.filter(contact => {
          Object.keys(connections).find(key => {
            if (connections[key].userId == contact._id) {
              return contact.active = true;
            }
            return contact.active = false;
          });
        });
        socket.emit('USER', userData);
        socket.broadcast.emit('CONTACT_STATUS', { id: userData._id, status: true });
      } catch (errorMessage) {
          socket.emit('ERROR', errorMessage);
      }
    });

    socket.on('JOIN_ROOM', async data => {
      const userId = connections[socket.id].userId;
      let chatData;
      //if the chat is clicked from the contact section (no chatId)
      if (data.direct) {
        const participents = {
          userId,
          contactId: data.chatData.contactId
        }
        chatData = await chatService.getDirectChat(participents);
        //if a new chat was made then get its data for that user
        if(chatData.newChat){
          const newChat = await contactService.getChat(userId, chatData.chatId);
          socket.emit('NEW_CHAT', newChat);
        }

      } else {
        chatData = await chatService.getChatMessages(data.chatData._id);
      }

      const chatId = chatData.chatId;
      const room = chatId;
      //leave the current room if it exists
      if (socket.room) socket.leave(socket.room);
      //join the room
      socket.join(room);
      socket.room = room;
      socket.emit('CHAT_DATA', chatData);
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
      socket.emit('PENDING_CONTACT', response.contactPending);
      //find that contacts socketId and send him the request
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
      } catch (err){
        console.log(err)
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
