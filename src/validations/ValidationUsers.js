import {
  body, param, query, validationResult,
} from 'express-validator';
import { responseError } from '../helpers/helpers.js';
import usersModel from '../models/users.js';

const validateResult = (req, res, next) => {
  const error = validationResult(req);
  if (error.isEmpty()) {
    next();
  } else {
    responseError(res, 'error', 422, 'invalid input', error.array());
  }
};

const rulesRegister = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 3, max: 255 })
    .withMessage('name length between 3 to 255'),
];

const rulesLogin = () => [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('The email you entered is not correct')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('password length between 8 to 255'),
];

const refreshToken = () => [body('refreshToken').notEmpty().withMessage('refreshToken is required')];

const rulesUpdateUser = () => [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .bail()
    .isLength({ min: 3, max: 225 })
    .withMessage('name length between 4 to 255'),
  body('username')
    .optional({ checkFalsy: true })
    .isLength({ min: 3, max: 225 })
    .withMessage('username length between 4 to 255')
    .bail()
    .custom(async (value) => {
      const existingUsername = await usersModel.checkExistUser(value, 'username');
      if (existingUsername.length > 0) {
        throw new Error('Username already registered');
      }
      return true;
    }),
  body('phone_number')
    .isNumeric()
    .withMessage('phone number must be number')
    .bail()
    .isLength({ min: 10, max: 15 })
    .withMessage('phone number must be more than 10 and less than 15 digits'),
  body('bio')
    .notEmpty()
    .withMessage('bio is required')
    .bail()
    .isLength({ min: 10 })
    .withMessage('bio must be more than 10 characters'),
];

const rulesCreatePassword = () => [
  body('password')
    .notEmpty()
    .withMessage('password is required')
    .bail()
    .isLength({ min: 8, max: 255 })
    .withMessage('password length between 8 to 255'),
];

const rulesCreateEmail = () => [
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .bail()
    .isEmail()
    .withMessage('The email you entered is not correct')
    .bail()
    .custom(async (value) => {
      const existingEmail = await usersModel.checkExistUser(value, 'email');
      if (existingEmail.length > 0) {
        throw new Error('e-mail already registered');
      }
      return true;
    }),
];

const rulesUpdateEmail = () => [
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('The email you entered is not correct')
    .bail()
    .custom(async (value) => {
      const existingEmail = await usersModel.checkExistUser(value, 'email');
      if (existingEmail.length > 0) {
        throw new Error('e-mail already registered');
      }
      return true;
    })
    .normalizeEmail(),
];

const rulesFileUploud = (req, res, next) => {
  if (req.files) {
    if (req.files.profile_img) {
      delete req.files.profile_img.data;
      req.body.profile_img = { ...req.files.profile_img };
    }
  }
  next();
};

const rulesUpdateImgUser = () => [
  body('profile_img')
    .optional({ checkFalsy: true })
    .custom((value) => {
      if (value.mimetype !== 'image/png' && value.mimetype !== 'image/jpeg') {
        throw new Error('avatar mmust be jpg or png');
      }
      return true;
    })
    .bail()
    .custom((value) => {
      if (parseInt(value.size, 10) > 2097152) {
        throw new Error('image size exceeds 2 megabytes');
      }
      return true;
    }),
];

const rulesReadUpdateDelete = () => [
  param('id')
    .isNumeric()
    .withMessage('id must be number')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be more than 0'),
];

const rulesRead = () => [
  query('limit')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('limit must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('limit must be more than 0'),
  query('page')
    .optional({ nullable: true })
    .isNumeric()
    .withMessage('page must be number')
    .bail()
    .isFloat({ min: 1 })
    .withMessage('page must be more than 0'),
  query('fieldOrder')
    .optional({ nullable: true })
    .notEmpty()
    .withMessage('fieldOrder is required')
    .bail()
    .isLength({ min: 1 })
    .withMessage('fieldOrder must be more than 0'),
];

const validate = (method) => {
  if (method === 'register') {
    return [rulesRegister(), rulesCreatePassword(), rulesCreateEmail(), validateResult];
  }
  if (method === 'login') {
    return [rulesLogin(), validateResult];
  }
  if (method === 'refreshToken') {
    return [refreshToken(), validateResult];
  }
  if (method === 'update') {
    return [
      rulesFileUploud,
      rulesReadUpdateDelete(),
      rulesUpdateImgUser(),
      rulesUpdateUser(),
      rulesUpdateEmail(),
      validateResult,
    ];
  }
  if (method === 'read') {
    return [rulesRead(), validateResult];
  }
  if (method === 'forgot-password') {
    return [
      body('email')
        .notEmpty()
        .withMessage('email is required')
        .bail()
        .isEmail()
        .withMessage('The email you entered is not correct'),
      validateResult,
    ];
  }
  if (method === 'reset-password') {
    return [rulesCreatePassword(), validateResult];
  }
};

export default validate;
