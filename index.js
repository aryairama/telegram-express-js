/* eslint-disable no-unused-vars */
import express from 'express';
import path from 'path';
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import { Server, Socket } from 'socket.io';
import { createServer } from 'http';
import { responseError } from './src/helpers/helpers.js';
import usersRouter from './src/routes/users.js';
import contactsRouter from './src/routes/contacts.js';

const app = express();
const port = process.env.PORT_APPLICATION;
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
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
app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'));
});
app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, []);
});
io.on('connection', (steam) => {
  console.log('ada connection');
});
httpServer.listen(port, () => {
  console.log(`Server running port ${port}`);
});
