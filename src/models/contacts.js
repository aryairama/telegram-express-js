const connection = require('../configs/db');
const { promiseResolveReject } = require('../helpers/helpers');

const getContactById = (id) => new Promise((resolve, reject) => {
  connection.query(
    `SELECT contacts.*,
    (SELECT name FROM users where user_id = contacts.owner_id ) AS owner_contact_name,
    users.name,users.email,users.username,users.phone_number,users.bio,users.profile_img
    FROM contacts INNER JOIN users ON contacts.owner_id = users.user_id WHERE contacts.owner_id = ?`,
    id,
    (error, result) => {
      promiseResolveReject(resolve, reject, error, result);
    },
  );
});

const privateContact = (search, order, fieldOrder, userId, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT contacts.*,
    (SELECT name FROM users where user_id = contacts.owner_id ) AS owner_contact_name,
    users.user_id,users.name,users.email,users.username,users.phone_number,users.bio,users.profile_img
    FROM contacts INNER JOIN users ON contacts.contact_user_id = users.user_id
    WHERE (users.name LIKE "%${search}%" OR users.username LIKE "%${search}%" OR users.phone_number LIKE "%${search}%")
    AND contacts.owner_id = ${userId}
    ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT contacts.*,
    (SELECT name FROM users where user_id = contacts.owner_id ) AS owner_contact_name,
    users.user_id,users.name,users.email,users.username,users.phone_number,users.bio,users.profile_img
    FROM contacts INNER JOIN users ON contacts.contact_user_id = users.user_id
    WHERE (users.name LIKE "%${search}%" OR users.username LIKE "%${search}%" OR users.phone_number LIKE "%${search}%")
    AND contacts.owner_id = ${userId}
    ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const publicContact = (search, order, fieldOrder, exceptUserId, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT profile_img,bio,phone_number,username,email,name,user_id
      FROM users WHERE (name LIKE "%${search}%" OR username LIKE "%${search}%" OR phone_number LIKE "%${search}%") 
      AND user_id NOT IN(${exceptUserId}) ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT profile_img,bio,phone_number,username,email,name,user_id
      FROM users WHERE (name LIKE "%${search}%" OR username LIKE "%${search}%" OR phone_number LIKE "%${search}%") 
      AND user_id NOT IN(${exceptUserId}) ORDER BY ${fieldOrder} ${order}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

const addContact = (data) => new Promise((resolve, reject) => {
  connection.query('INSERT INTO contacts set ?', data, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const deleteContact = (id) => new Promise((resolve, reject) => {
  connection.query('DELETE FROM contacts where contact_id = ?', id, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const checkExistContact = (fieldValue, field) => new Promise((resolve, reject) => {
  connection.query(`SELECT * FROM contacts where ${field} = ?`, fieldValue, (error, result) => {
    promiseResolveReject(resolve, reject, error, result);
  });
});

const listContactMessage = (search, order, fieldOrder, userLogin, start = '', limit = '') => new Promise((resolve, reject) => {
  if (limit !== '' && start !== '') {
    connection.query(
      `SELECT DISTINCT contacts.contact_id,
      users.user_id,users.name,users.email,
      users.username,users.phone_number,users.bio,users.profile_img,
      (SELECT COUNT(*) FROM messages where (read_message = 0) AND (receiver_id = '${userLogin}' AND sender_id = users.user_id)) AS unread,
      (SELECT message FROM messages where (receiver_id = '${userLogin}' AND sender_id = users.user_id) 
      OR (receiver_id = users.user_id AND sender_id = '${userLogin}') ORDER BY created_at DESC LIMIT 1) AS current_message,
      (SELECT created_at FROM messages where (receiver_id = '${userLogin}' AND sender_id = users.user_id) 
      OR (receiver_id = users.user_id AND sender_id = '${userLogin}') ORDER BY created_at DESC LIMIT 1) AS current_create_message
      FROM users INNER JOIN messages on (users.user_id = messages.sender_id OR users.user_id = messages.receiver_id)
      LEFT JOIN contacts ON contacts.owner_id = ${userLogin} AND contacts.contact_user_id = users.user_id
      WHERE (users.name LIKE "%${search}%" OR users.username LIKE "%${search}%" OR users.phone_number LIKE "%${search}%")
      AND (messages.receiver_id = ${userLogin} OR messages.sender_id = ${userLogin}) AND users.user_id != ${userLogin}
      ORDER BY ${fieldOrder} ${order} LIMIT ${start} , ${limit}`,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  } else {
    connection.query(
      `SELECT DISTINCT contacts.contact_id,
      users.user_id,users.name,users.email,
      users.username,users.phone_number,users.bio,users.profile_img,
      (SELECT COUNT(*) FROM messages where (read_message = 0) AND (receiver_id = '${userLogin}' AND sender_id = users.user_id)) AS unread,
      (SELECT message FROM messages where (receiver_id = '${userLogin}' AND sender_id = users.user_id) 
      OR (receiver_id = users.user_id AND sender_id = '${userLogin}') ORDER BY created_at DESC LIMIT 1) AS current_message,
      (SELECT created_at FROM messages where (receiver_id = '${userLogin}' AND sender_id = users.user_id) 
      OR (receiver_id = users.user_id AND sender_id = '${userLogin}') ORDER BY created_at DESC LIMIT 1) AS current_create_message
      FROM users INNER JOIN messages on (users.user_id = messages.sender_id OR users.user_id = messages.receiver_id)
      LEFT JOIN contacts ON contacts.owner_id = ${userLogin} AND contacts.contact_user_id = users.user_id
      WHERE (users.name LIKE "%${search}%" OR users.username LIKE "%${search}%" OR users.phone_number LIKE "%${search}%")
      AND (messages.receiver_id = ${userLogin} OR messages.sender_id = ${userLogin}) AND users.user_id != ${userLogin}
      ORDER BY ${fieldOrder} ${order} `,
      (error, result) => {
        promiseResolveReject(resolve, reject, error, result);
      },
    );
  }
});

module.exports = {
  getContactById,
  privateContact,
  publicContact,
  addContact,
  deleteContact,
  checkExistContact,
  listContactMessage,
};
