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

module.exports = {
  addMessage, readMessage, checkExistMessage, deleteMessage,
};
