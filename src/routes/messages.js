import express from 'express';
import ControllerMessages from '../controllers/ControllerMessages.js';
import { Auth } from '../middlewares/Auth.js';

const router = express.Router();

router.get('/:receiver_id', Auth, ControllerMessages.readMessage);

export default router;
