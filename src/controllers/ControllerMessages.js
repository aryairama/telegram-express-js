const messagesModel = require('../models/messages');
const { response, responseError } = require('../helpers/helpers');

const readMessage = async (req, res, next) => {
  try {
    const dataMessages = await messagesModel.readMessage(req.params.receiver_id, req.userLogin.user_id);
    response(res, 'Success', 200, 'data messages', dataMessages);
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const checkExistMessage = await messagesModel.checkExistMessage(req.params.id, 'message_id');
    if (checkExistMessage.length > 0) {
      const deleteDataMessage = await messagesModel.deleteMessage(req.params.id);
      if (deleteDataMessage.affectedRows) {
        req.io.in(`chatuserid:${checkExistMessage[0].sender_id}`).emit('reloadContact', true);
        req.io.in(`chatuserid:${checkExistMessage[0].receiver_id}`).emit('reloadContact', true);
        req.io.in(`chatuserid:${checkExistMessage[0].receiver_id}`).emit('replyDeleteChat', {
          receiver_id: checkExistMessage[0].receiver_id,
          sender_id: checkExistMessage[0].sender_id,
        });
        response(res, 'success', 200, 'successfully delete message data', {});
      } else {
        responseError(res, 'failed', 500, 'failed delete message', {});
      }
    } else {
      responseError(res, 'failed', 404, 'data message not found', {});
    }
  } catch (error) {
    next(error);
  }
};

const readStatusMessages = async (req, res, next) => {
  try {
    const unreadMessages = await messagesModel.unreadMessages(req.body.sender_id, req.body.receiver_id);
    const unreadMessageid = unreadMessages.map((unreadMessage) => unreadMessage.message_id);
    if (unreadMessageid.length > 0) {
      await messagesModel.updateUnreadToReadMessages('1', unreadMessageid);
      req.io.in(`chatuserid:${req.userLogin.user_id}`).emit('reloadContact', true);
    }
    response(res, 'update status message', 200, 'update unread message to read message', []);
  } catch (error) {
    next(error);
  }
};

const clearHistoryMessages = async (req, res, next) => {
  try {
    const deleteDataHistory = await messagesModel.clearHistory(req.body.sender_id, req.body.receiver_id);
    if (deleteDataHistory.affectedRows) {
      req.io.in(`chatuserid:${req.body.sender_id}`).emit('reloadContact', true);
      req.io.in(`chatuserid:${req.body.receiver_id}`).emit('reloadContact', true);
      req.io.in(`chatuserid:${req.body.receiver_id}`).emit('replyClearHistoryChat', {
        receiver_id: req.body.receiver_id,
        sender_id: req.body.sender_id,
      });
      response(res, 'success', 200, 'successfully delete message data', {});
    } else if (deleteDataHistory.affectedRows === 0) {
      response(res, 'success', 200, 'you dont have any message', {});
    } else {
      responseError(res, 'failed', 500, 'failed delete message', {});
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  readMessage,
  deleteMessage,
  readStatusMessages,
  clearHistoryMessages,
};
