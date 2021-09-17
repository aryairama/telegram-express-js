const express = require('express');
const ControllerContacts = require('../controllers/ControllerContacts');
const ValidationContacts = require('../validations/ValidationContacts');
const { Auth } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/', Auth, ValidationContacts('read'), ControllerContacts.readContact)
  .post('/', Auth, ValidationContacts('add'), ControllerContacts.addContact)
  .delete('/:contact_id', Auth, ValidationContacts('delete'), ControllerContacts.deleteContact)
  .get('/list-contact', Auth, ValidationContacts('read'), ControllerContacts.listContactMessage)
  .get('/private', Auth, ValidationContacts('read'), ControllerContacts.privateContact);

module.exports = router;
