const { validationResult, param } = require('express-validator');
const { responseError } = require('../helpers/helpers');

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesDeleteMessage = () => [
  param('id')
    .notEmpty()
    .withMessage('message_id is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('message_id must be more than 0 character'),
];

const validate = (method) => {
  if (method === 'delete') {
    return [rulesDeleteMessage(), validateResult];
  }
};

module.exports = validate;
