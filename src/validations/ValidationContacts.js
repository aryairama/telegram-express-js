import {
  param, body, query, validationResult,
} from 'express-validator';
import { responseError } from '../helpers/helpers.js';

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};
const rulesRead = () => [
  query('limit')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('limit must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('limit must be more than 0'),
  query('page')
    .optional({ checkFalsy: true })
    .isNumeric()
    .withMessage('page must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('page must be more than 0'),
  query('fieldOrder')
    .optional({ checkFalsy: true })
    .notEmpty()
    .withMessage('fieldOrder is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('fieldOrder must be more than 0'),
];

const rulesAddContact = () => [
  body('user_id')
    .notEmpty()
    .withMessage('contact_id is required')
    .bail()
    .isNumeric()
    .withMessage('user_id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('user_id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('user_id must be more than 0 and less than 10 digits'),
];

const rulesDeleteContact = () => [
  param('contact_id')
    .notEmpty()
    .withMessage('contact_id is required')
    .bail()
    .isNumeric()
    .withMessage('user_id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('user_id must be more than 0')
    .bail()
    .isLength({ min: 1, max: 10 })
    .withMessage('user_id must be more than 0 and less than 10 digits'),
];

const validate = (method) => {
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'add') {
    return [rulesAddContact(), validateResult];
  }
  if (method === 'delete') {
    return [rulesDeleteContact(), validateResult];
  }
};

export default validate;
