const express = require('express');
const ControllerUsers = require('../controllers/ControllerUsers');
const ValidationUsers = require('../validations/ValidationUsers');
const { Auth } = require('../middlewares/Auth');

const router = express.Router();

router
  .get('/profile', Auth, ControllerUsers.profile)
  .post('/register', ValidationUsers('register'), ControllerUsers.register)
  .post('/checktoken', ControllerUsers.checkToken)
  .post('/verifemail', ControllerUsers.verifEmail)
  .delete('/logout', Auth, ControllerUsers.logout)
  .post('/login', ValidationUsers('login'), ControllerUsers.login)
  .post('/refreshtoken', ControllerUsers.refreshToken)
  .post('/forgot-password', ValidationUsers('forgot-password'), ControllerUsers.forgotPassword)
  .post('/reset-password', ValidationUsers('reset-password'), ControllerUsers.resetPassword)
  .patch('/update-password', Auth, ValidationUsers('update-password'), ControllerUsers.updatePassword)
  .post('/delete', Auth, ValidationUsers('delete'), ControllerUsers.deleteAccount)
  .post('/:id', Auth, ValidationUsers('update'), ControllerUsers.updateUser)
  .get('/status/:id', Auth, ValidationUsers('status'), ControllerUsers.getStatus);

module.exports = router;
