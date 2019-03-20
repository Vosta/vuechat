const userDisconnect = (socket, connections) => {
    if (connections[socket.id]) {
      const user = connections[socket.id];
      socket.broadcast.emit('CONTACT_STATUS', { id: user.userId, status: false });
      delete connections[socket.id];
      console.log('User disconnected');
      return connections;
    }
  }



  module.exports = {userDisconnect}