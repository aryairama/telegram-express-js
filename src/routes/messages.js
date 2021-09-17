const express = require('express');
const ControllerMessages = require('../controllers/ControllerMessages');
const { Auth } = require('../middlewares/Auth');

const router = express.Router();

router.get('/:receiver_id', Auth, ControllerMessages.readMessage);

module.exports = router;
