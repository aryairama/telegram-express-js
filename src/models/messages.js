const mysql = require('mysql2');
const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const addMessage = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO messages set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const readMessage = (idReceiver, idSender) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT * FROM messages where (receiver_id = '${idReceiver}' AND sender_id = '${idSender}') 
  OR (receiver_id = '${idSender}' AND sender_id = '${idReceiver}') ORDER BY created_at ASC`,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const checkExistMessage = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM messages WHERE ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const deleteMessage = (idMessage) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM messages WHERE message_id = ?', idMessage, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const unreadMessages = (senderId, receiverId) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT * FROM messages where (read_message = 0) AND (receiver_id = '${receiverId}' AND sender_id = ${senderId})`,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const updateUnreadToReadMessages = (status, messageId) => new Promise((resolve, reject) => {
  let query = '';
  messageId.forEach((id) => {
    query += mysql.format(`UPDATE messages SET read_message = ${status} WHERE message_id = ?;`, id);
  });
  connection.query(query, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const clearHistory = (idSender, idReceiver) => new Promise((resolve, reject) => {
  connection.query(
    `DELETE FROM messages where (receiver_id = '${idReceiver}' AND sender_id = '${idSender}') 
  OR (receiver_id = '${idSender}' AND sender_id = '${idReceiver}')`,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

module.exports = {
  addMessage,
  readMessage,
  checkExistMessage,
  deleteMessage,
  unreadMessages,
  updateUnreadToReadMessages,
  clearHistory,
};
