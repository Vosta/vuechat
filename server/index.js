const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);

const auth = require('./auth/index');
const user = require('./user/index');

app.use(volleyball);
app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(express.json());

app.get('/', (req, res)=> {
    res.json({
        message: 'hi'
    });
});

//leads to auth/index.js
app.use('/auth', auth);
app.use('/', user);

// Setting up Socket.io

const io = require('socket.io')(server);

io.on("connection", function(socket){
  console.log('got it');

  socket.on('disconnect', async () => {
    console.log('User Disconnected');
  });

  socket.on('message', async (data) => {
    console.log(data);
    io.emit("messageSent", data);
  })

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
