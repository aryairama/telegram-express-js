import bcrypt from 'bcrypt';
import path from 'path';
import fs from 'fs/promises';
import Jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import usersModel from '../models/users.js';
import { redis } from '../configs/redis.js';
import { genAccessToken, genRefreshToken, genVerifEmailToken } from '../helpers/jwt.js';
import {
  response,
  responseError,
  // responsePagination,
  responseCookie,
  sendVerifEmailRegister,
  sendResetPassword,
  createFolderImg,
} from '../helpers/helpers.js';

const register = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const data = {
      name: req.body.name,
      email: req.body.email,
      password: await bcrypt.hash(req.body.password, salt),
    };
    const addDataUser = await usersModel.insertUser(data);
    if (addDataUser.affectedRows) {
      delete data.password;
      response(res, 'success', 200, 'successfully added user data', data);
      const token = await genVerifEmailToken({ ...data, user_id: addDataUser.insertId }, { expiresIn: 60 * 60 * 24 });
      await sendVerifEmailRegister(token, data.email, data.name);
    }
  } catch (error) {
    next(error);
  }
};

const checkToken = (req, res, next) => {
  try {
    let tokenVerif;
    let secretKey;
    if (req.body.token === 'email') {
      tokenVerif = req.cookies.tokenEmail;
      secretKey = process.env.VERIF_EMAIL_TOKEN_SECRET;
    } else if (req.body.token === 'password') {
      tokenVerif = req.cookies.tokenPassword;
      secretKey = process.env.FORGOT_PASSWORD_TOKEN_SECRET;
    }
    if (!tokenVerif) {
      return responseError(res, 'Check Token failed', 403, 'Server need tokenverifemail', []);
    }
    Jwt.verify(tokenVerif, secretKey, (error, decode) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          return responseError(res, 'Authorized failed', 401, 'token expired', []);
          // eslint-disable-next-line no-else-return
        } else if (error.name === 'JsonWebTokenError') {
          return responseError(res, 'Authorized failed', 401, 'token invalid', []);
        } else {
          return responseError(res, 'Authorized failed', 401, 'token not active', []);
        }
      }
      response(res, 'Token Valid', 200, 'Token verif email valid', decode);
    });
  } catch (error) {
    next(error);
  }
};

const verifEmail = async (req, res, next) => {
  try {
    Jwt.verify(req.cookies.tokenEmail, process.env.VERIF_EMAIL_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
      }
      redis.get(`jwtEmailVerToken-${decode.user_id}`, async (error, result) => {
        if (result !== null) {
          const updateVerifEmail = await usersModel.updateUser({ verif_email: 1 }, decode.user_id);
          if (updateVerifEmail.affectedRows) {
            redis.del(`jwtEmailVerToken-${decode.user_id}`);
            return response(res, 'success', 200, 'successfully verified email', []);
          }
        } else {
          const checkVerifEmail = await usersModel.checkExistUser(decode.user_id, 'user_id');
          if (checkVerifEmail[0].verif_email === 1) {
            response(res, 'success', 201, 'Email is verified', []);
          } else if (checkVerifEmail[0].verif_email === 0) {
            responseError(res, 'Verif failed', 403, 'Verif Register Email failed', []);
          }
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const profile = async (req, res, next) => {
  try {
    const getProfile = await usersModel.checkExistUser(req.userLogin.user_id, 'user_id');
    delete getProfile[0].password;
    response(res, 'Success', 200, 'User profile', getProfile[0]);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const checkExistUser = await usersModel.checkExistUser(req.body.email, 'email');
    if (checkExistUser.length > 0) {
      if (checkExistUser[0].verif_email === 0) {
        return responseError(res, 'Email not verified', 403, 'Email has not been verified', {});
      }
      if (checkExistUser[0].account_status !== 'active') {
        return responseError(res, 'Account not Found', 404, 'Your account not found in database', {});
      }
      const comparePassword = await bcrypt.compare(req.body.password, checkExistUser[0].password);
      if (comparePassword) {
        delete checkExistUser[0].password;
        const accessToken = await genAccessToken({ ...checkExistUser[0] }, { expiresIn: 60 * 60 * 2 });
        const refreshToken = await genRefreshToken({ ...checkExistUser[0] }, { expiresIn: 60 * 60 * 4 });
        responseCookie(
          res,
          'Success',
          200,
          'Login success',
          { ...checkExistUser[0] },
          { accessToken, refreshToken },
          {
            httpOnly: true,
            secure: true,
          },
        );
      } else {
        responseError(res, 'Authorized failed', 401, 'Wrong password', {
          password: 'passwords dont match',
        });
      }
    } else {
      responseError(res, 'Authorized failed', 401, 'User not Found', {
        email: 'email not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

const logout = (req, res, next) => {
  try {
    // eslint-disable-next-line no-unused-vars
    redis.del(`jwtRefToken-${req.userLogin.user_id}`, async (error, result) => {
      if (error) {
        next(error);
      } else {
        res.clearCookie('authTelegram');
        await usersModel.updateUser({ online: 0 }, req.userLogin.user_id);
        req.io.emit('status_offline', { user_id: req.userLogin.user_id });
        response(res, 'Logout', 200, 'Logout success', []);
      }
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.authTelegram;
    if (!token) {
      return responseError(res, 'Authorized failed', 401, 'Server need refreshToken', []);
    }
    Jwt.verify(token.refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          res.clearCookie('authTelegram');
          return responseError(res, 'Authorized failed', 401, 'refreshToken expired', []);
        }
        if (err.name === 'JsonWebTokenError') {
          return responseError(res, 'Authorized failed', 401, 'token invalid', []);
        }
        return responseError(res, 'Authorized failed', 401, 'token not active', []);
      }
      // eslint-disable-next-line no-unused-vars
      const cacheRefToken = redis.get(`jwtRefToken-${decode.user_id}`, async (error, cacheToken) => {
        if (cacheToken === token.refreshToken) {
          delete decode.iat;
          delete decode.exp;
          redis.del(`jwtRefToken-${decode.user_id}`);
          const accessToken = await genAccessToken(decode, { expiresIn: 60 * 60 * 2 });
          const newRefToken = await genRefreshToken(decode, { expiresIn: 60 * 60 * 4 });
          responseCookie(
            res,
            'Success',
            200,
            'AccessToken',
            {},
            { accessToken, refreshToken: newRefToken },
            {
              httpOnly: true,
              secure: true,
            },
          );
        } else {
          responseError(res, 'Authorized failed', 403, 'Wrong refreshToken', []);
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await usersModel.checkExistUser(email, 'email');
    if (user.length > 0) {
      const id = user[0].user_id;
      const token = Jwt.sign({ id, email }, process.env.FORGOT_PASSWORD_TOKEN_SECRET, { expiresIn: '24h' });
      redis.set(`JWTFORGOT-${id}`, token);
      response(res, 'Success', 200, 'Successfully create token, check email for reset password');
      await sendResetPassword(token, email, user[0].name);
    } else {
      response(res, 'Not found', 404, 'Email not found', {});
    }
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    Jwt.verify(req.body.tokenPassword, process.env.FORGOT_PASSWORD_TOKEN_SECRET, (err, decode) => {
      if (err) {
        return responseError(res, 'Reset password failed', 403, 'Reset password failed', {});
      }
      redis.get(`JWTFORGOT-${decode.id}`, async (error, result) => {
        if (result !== null) {
          const salt = await bcrypt.genSalt(10);
          const data = {
            password: await bcrypt.hash(req.body.password, salt),
          };
          const updatePassword = await usersModel.updateUser(data, decode.id);
          if (updatePassword.affectedRows) {
            redis.del(`JWTFORGOT-${decode.id}`);
            return response(res, 'success', 200, 'Successfully reset password', []);
          }
        } else {
          responseError(res, 'Reset password failed', 403, 'Reset password failed', {});
        }
      });
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    let data = {
      name: req.body.name,
      phone_number: req.body.phone_number,
      bio: req.body.bio,
    };
    const checkExistUser = await usersModel.checkExistUser(req.params.id, 'user_id');
    if (checkExistUser.length > 0) {
      if (req.body.email) {
        data = { ...data, email: req.body.email };
      }
      if (req.body.username) {
        data = { ...data, username: req.body.username };
      }
      if (req.files) {
        createFolderImg('/public/img/profile_img');
        if (checkExistUser[0].profile_img && checkExistUser[0].profile_img.length > 10) {
          fs.unlink(path.join(path.dirname(''), `/${checkExistUser[0].profile_img}`));
        }
        const fileName = uuidv4() + path.extname(req.files.profile_img.name);
        const savePath = path.join(path.dirname(''), '/public/img/profile_img', fileName);
        data = { ...data, profile_img: `public/img/profile_img/${fileName}` };
        await req.files.profile_img.mv(savePath);
      }
      const changeDataUser = await usersModel.updateUser(data, req.params.id);
      if (changeDataUser.affectedRows) {
        response(res, 'success', 200, 'successfully updated user data', data);
      }
    } else {
      response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const getDataUser = await usersModel.checkExistUser(req.userLogin.user_id, 'user_id');
    if (getDataUser.length > 0) {
      const comparePassword = await bcrypt.compare(req.body.old_password, getDataUser[0].password);
      if (comparePassword) {
        const salt = await bcrypt.genSalt(10);
        const changePassword = await usersModel.updateUser(
          { password: await bcrypt.hash(req.body.new_password, salt) },
          req.userLogin.user_id,
        );
        if (changePassword.affectedRows) {
          return response(res, 'success', 200, 'successfully updated user data');
        }
      } else {
        return response(res, 'failed', 403, "passwords isn't match", []);
      }
    } else {
      return response(res, 'failed', 404, 'the data you want to update does not exist', []);
    }
  } catch (error) {
    next(error);
  }
};

const getStatus = async (req, res, next) => {
  try {
    const dataStatus = await usersModel.checkExistUser(req.params.id, 'user_id');
    if (dataStatus.length > 0) {
      response(res, 'Data Status', 200, 'Data status Online/Offline', { online: dataStatus[0].online });
    } else {
      response(res, 'failed', 404, 'user not found', {});
    }
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  verifEmail,
  checkToken,
  profile,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  updateUser,
  updatePassword,
  getStatus,
};
