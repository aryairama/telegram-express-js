const express = require('express');
const ControllerMessages = require('../controllers/ControllerMessages');
const ValidationMessages = require('../validations/ValidationMessages');
const { Auth } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/:receiver_id', Auth, ControllerMessages.readMessage)
  .delete('/:id', Auth, ValidationMessages('delete'), ControllerMessages.deleteMessage)
  .post('/read', Auth, ValidationMessages('readStatusMessages'), ControllerMessages.readStatusMessages);

module.exports = router;
