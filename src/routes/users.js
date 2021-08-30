import express from 'express';
import ControllerUsers from '../controllers/ControllerUsers.js';
import ValidationUsers from '../validations/ValidationUsers.js';
import { Auth } from '../middlewares/Auth.js';

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
  .post('/reset-password', ValidationUsers('reset-password'), ControllerUsers.resetPassword);

export default router;
