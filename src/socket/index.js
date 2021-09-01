import { v4 as uuidv4 } from 'uuid';
import messagesModel from '../models/messages.js';
import usersModel from '../models/users.js';

const listenSocket = (io) => {
  io.on('connection', (socket) => {
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
        }
      } catch (error) {
        console.log(error);
      }
    });
    console.log(`user connected with user id ${socket.id}`);
  });
};

export default listenSocket;
