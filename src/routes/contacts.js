import express from 'express';
import ControllerContacts from '../controllers/ControllerContacts.js';
import ValidationContacts from '../validations/ValidationContacts.js';
import { Auth } from '../middlewares/Auth.js';

const router = express.Router();

router
  .get('/', Auth, ValidationContacts('read'), ControllerContacts.readContact)
  .post('/', Auth, ValidationContacts('add'), ControllerContacts.addContact)
  .delete('/:contact_id', Auth, ValidationContacts('delete'), ControllerContacts.deleteContact)
  .get('/private', Auth, ValidationContacts('read'), ControllerContacts.privateContact);

export default router;
