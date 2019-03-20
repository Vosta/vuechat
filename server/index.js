const express = require('express');
const volleyball = require('volleyball');
const cors = require('cors');
const socket = require('./socket/index');
require('dotenv').config();


const app = express();
const server = require('http').Server(app);

const auth = require('./routes/auth');
const assets = require('./routes/assets');


app.use(volleyball);
app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(express.json());

app.use('/auth', auth);
app.use('/assets', assets);

// Socket.io connection
socket.listen(server);

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
