const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');

function generateSendJWT(res, statusCode, user, message) {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: 'success',
    user: {
      token,
      id: user._id,
      name: user.name,
    },
    message,
  });
}
const isAuth = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    allError(401, '尚未登入', next);
  }
  // token解密
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id);
  // req.user是自定義的屬性資料
  req.user = currentUser;
  next();
};
const isAuthWithPassword = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    allError(401, '尚未登入', next);
  }
  // token解密
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await User.findById(decoded.id).select('+password');
  req.user = currentUser;
  next();
};

module.exports = { generateSendJWT, isAuth, isAuthWithPassword };
