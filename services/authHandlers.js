const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const { allError } = require('../services/errorHandlers');
const validator = require('validator');

// 回傳登入token
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

// 檢查是否登入，沒登入回傳error
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

// 檢查是否登入，加上回傳密碼
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

// 檢查是否登入，但不會阻擋回傳error
const isLogin = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (token) {
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
  }
  next();
};

// 使用：變更密碼
const checkOldPassword = async(req, res, next) =>{
  const { oldPassword } = req.body;
  if (!oldPassword) {
    allError(400, '原密碼尚未填寫', next);
  }
  const result = awaitbcrypt.compare(oldPassword, req.user.password)
  if(!result){
    allError(400, '原密碼填寫錯誤', next);
  }
  next();
};

// 使用：變更密碼
const isSamePassword  = (req, res, next) =>{
  const { oldPassword, password } = req.body;
  if (oldPassword === password) {
    allError(400, '新密碼與原密碼相同', next);
  }
  next();
};

// 使用：註冊、登入
const checkEmail = (req, res, next) =>{
  var emailPat = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; //true,說明email格式正確
  if (req.body.email.match(emailPat)) {
    next();
  } else {
    allError(400, 'Email尚未填寫或填寫不正確', next);
  }
};

// 使用：註冊、登入
const checkPassword = (req, res, next) => {
  var checkNumber = /[0-9]/; //true,說明有數字
  var checkEnglish = /[a-z]/i; //true,說明有英文字母
  var checkChinese = new RegExp('[\\u4E00-\\u9FFF]+', 'g'); //true,說明有漢字
  if (checkChinese.test(req.body.password)) {
    allError(400, '密碼只能包含英文、數字', next);
  } else if (req.body.password.length === 0) {
    allError(400, '密碼尚未填寫', next);
  } else if (!validator.isLength(req.body.password, { min: 8 })) {
    allError(400, '密碼少於8碼', next);
  } else if (
    checkNumber.test(req.body.password) === false ||
    checkEnglish.test(req.body.password) === false
  ) {
    allError(400, '密碼需要包含數字與英文', next);
  } else {
    next();
  }
};

module.exports = {
  generateSendJWT,
  isAuth,
  isAuthWithPassword,
  isLogin,
  checkPassword,
  checkEmail,
  checkOldPassword,
  isSamePassword,
};
