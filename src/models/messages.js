import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

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
export default { addMessage, readMessage };
