import Jwt from 'jsonwebtoken';
import { responseError } from '../helpers/helpers.js';

export const Auth = (req, res, next) => {
  try {
    const token = req.cookies.authVehicleRental;
    if (!token) {
      return responseError(res, 'Authorized failed', 401, 'Server need accessToken', []);
    }
    Jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return responseError(res, 'Authorized failed', 401, 'token expired', []);
        }
        if (err.name === 'JsonWebTokenError') {
          return responseError(res, 'Authorized failed', 401, 'token invalid', []);
        }
        return responseError(res, 'Authorized failed', 401, 'token not active', []);
      }
      req.userLogin = decode;
      next();
    });
  } catch (error) {
    next(error);
  }
};

export const Role = (...roles) => (req, res, next) => {
  let accesDenied = 0;
  for (let i = 0; i < roles.length; i += 1) {
    if (req.userLogin.roles !== roles[i]) {
      accesDenied += 1;
    } else if (req.userLogin.roles === roles[i]) {
      accesDenied = 0;
      break;
    }
  }
  if (accesDenied === 0) {
    next();
  } else if (accesDenied > 0) {
    responseError(res, 'Access Denied', 403, 'You do not have permission for this service', []);
  }
};
