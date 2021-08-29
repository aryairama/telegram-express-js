import path from 'path';
import checkFolder from 'fs';
import mailer from '../configs/nodemailer.js';
import templateVerifEmail from '../templates/verifEmail.js';

const response = (res, status, statusCode, message, data) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
  });
};
const responsePagination = (res, status, statusCode, message, data, pagination) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    data,
    pagination,
  });
};

const responseError = (res, status, statusCode, message, error) => {
  res.status(statusCode).json({
    status,
    statusCode,
    message,
    error,
  });
};

const promiseResolveReject = (resolve, reject, error, result) => {
  if (!error) {
    resolve(result);
  } else {
    reject(error);
  }
};

const responseCookie = (res, status, statusCode, message, data, dataCookie, optionCookie) => {
  res
    .cookie('authTelegram', dataCookie, { ...optionCookie })
    .status(statusCode)
    .json({
      status,
      statusCode,
      message,
      data,
    });
};

const createFolderImg = (direktori) => {
  if (!checkFolder.existsSync(path.join(path.dirname(''), direktori))) {
    checkFolder.mkdirSync(path.join(path.dirname(''), direktori), { recursive: true });
  }
};

const sendVerifEmailRegister = async (token, emailTo, name) => {
  try {
    await mailer.sendMail({
      from: `"Ceo Telegram" <${process.env.NODEMAILER_AUTH_USER}>`,
      to: emailTo,
      subject: 'Verify Email Address',
      html: templateVerifEmail(token, name),
    });
  } catch (error) {
    console.log(error);
  }
};

export {
  response,
  responseError,
  promiseResolveReject,
  responsePagination,
  createFolderImg,
  responseCookie,
  sendVerifEmailRegister,
};
