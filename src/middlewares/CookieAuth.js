import Jwt from 'jsonwebtoken';

const CookieAuth = (socket, next) => {
  const token = socket.request.cookies.authTelegram;
  if (!token) {
    const error = new Error('Server need accessToken');
    error.status = 401;
    return next(error);
  }
  Jwt.verify(token.accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decode) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        const error = new Error('token expired');
        error.status = 401;
        return next(error);
      }
      if (err.name === 'JsonWebTokenError') {
        const error = new Error('token invalid');
        error.status = 401;
        return next(error);
      }
      const error = new Error('token not active');
      error.status = 401;
      return next(error);
    }
    socket.id = decode.user_id;
    socket.join(`chatuserid:${decode.user_id}`);
    next();
  });
};

export default CookieAuth;
