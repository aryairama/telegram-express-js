import messagesModel from '../models/messages.js';
import { response } from '../helpers/helpers.js';

const readMessage = async (req, res, next) => {
  try {
    const dataMessages = await messagesModel.readMessage(req.params.receiver_id, req.userLogin.user_id);
    response(res, 'Success', 200, 'data messages', dataMessages);
  } catch (error) {
    next(error);
  }
};

export default { readMessage };
