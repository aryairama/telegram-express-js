const messagesModel = require('../models/messages');
const { response } = require('../helpers/helpers');

const readMessage = async (req, res, next) => {
  try {
    const dataMessages = await messagesModel.readMessage(req.params.receiver_id, req.userLogin.user_id);
    response(res, 'Success', 200, 'data messages', dataMessages);
  } catch (error) {
    next(error);
  }
};

module.exports = { readMessage };
