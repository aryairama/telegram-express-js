import connection from '../configs/db.js';
import { promiseResolveReject } from '../helpers/helpers.js';

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
    users.name,users.email,users.username,users.phone_number,users.bio,users.profile_img
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
    users.name,users.email,users.username,users.phone_number,users.bio,users.profile_img
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

export default {
  getContactById,
  privateContact,
  publicContact,
  addContact,
  deleteContact,
  checkExistContact,
};
