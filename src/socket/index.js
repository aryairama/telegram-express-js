import { v4 as uuidv4 } from 'uuid';
import messagesModel from '../models/messages.js';
import usersModel from '../models/users.js';

const listenSocket = (io) => {
  io.on('connection', async (socket) => {
    await usersModel.updateUser({ online: 1 }, socket.id);
    socket.broadcast.emit('status_online', { user_id: socket.id });
    socket.on('sendMessageFR', async (data, callback) => {
      try {
        data.message_id = uuidv4();
        data.created_at = new Date();
        const addMessage = await messagesModel.addMessage(data);
        const senderMame = await usersModel.checkExistUser(data.sender_id, 'user_id');
        if (addMessage.affectedRows) {
          callback(data);
          data.sender_name = senderMame[0].name;
          socket.broadcast.to(`chatuserid:${data.receiver_id}`).emit('replySendMessageBE', data);
          socket.broadcast.to(`chatuserid:${data.receiver_id}`).emit('reloadContact', true);
          io.in(`chatuserid:${socket.id}`).emit('reloadContact', true);
        }
      } catch (error) {
        console.log(error);
      }
    });
    socket.on('reconnect', async () => {
      await usersModel.updateUser({ online: 0 }, socket.id);
      socket.broadcast.emit('status_online', { user_id: socket.id });
    });
    socket.on('disconnect', async () => {
      await usersModel.updateUser({ online: 0 }, socket.id);
      socket.broadcast.emit('status_offline', { user_id: socket.id });
    });
  });
};

export default listenSocket;