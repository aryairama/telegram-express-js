/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const { Server, Socket } = require('socket.io');
const { createServer } = require('http');
const ioCookieParser = require('socket.io-cookie-parser');
const { responseError } = require('./src/helpers/helpers');
const usersRouter = require('./src/routes/users');
const contactsRouter = require('./src/routes/contacts');
const messagesRouter = require('./src/routes/messages');
const CookieAuth = require('./src/middlewares/CookieAuth');
const listenSocket = require('./src/socket/index');

const app = express();
const port = process.env.PORT;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  },
});
app.use('/public', express.static(path.resolve('./public')));
app.use(fileUpload());
app.use(
  cors({
    credentials: JSON.parse(process.env.CREDENTIALS),
    origin(origin, callback) {
      if (process.env.CORS_ORIGIN.indexOf(origin) !== -1 || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  }),
);
app.use((req, res, next) => {
  req.io = io;
  next();
});
app.use(cookieParser());
app.use(express.json());
app.use('/users', usersRouter);
app.use('/contacts', contactsRouter);
app.use('/messages', messagesRouter);
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
io.use(ioCookieParser());
io.use(CookieAuth);
listenSocket(io);
httpServer.listen(port, () => {
  console.log(`Server running port ${port}`);
});
