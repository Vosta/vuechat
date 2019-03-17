const verify = require('../middlewears/verify');

module.exports = function(io, connections) {
    io.on("connection", function (socket, data) {
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
      
        socket.on('GET_USER_DATA', async () => {
            console.log('here')
            console.log(socket.id)
          //put contact in activeConnections array
          
        });
        //find a solution to combine these
        socket.on('disconnect', () => {
          userDisconnect();
        });
        socket.on('userDisconnect', () => {
          userDisconnect();
        })
      
        
          /*connections[socket.id] = {
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
          socket.emit('ActiveUsers', data);
        });
      })
      /*
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
          console.info(socket.id + ' joined room ' + room);
        });
      
        socket.on('addContact', (contactId) => {
          contactId = contactId.toString();
          console.log(contactId)
          Object.keys(connections).find(key => {
            if (connections[key].userId === contactId) {
              console.log('YES')
              const currentUser = connections[socket.id].userId;
              io.to(key).emit('contactRequest', currentUser);
              return;
            }
          });
          return;
        });
        
        socket.on('message', (data) => {
          const room = data.chatId;
          socket.broadcast.to(room).emit('recieveMessage', {
            message: data.message,
            chatId: room
          });*/
        });
}
