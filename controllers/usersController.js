const User = require('../models/usersModel');
const { returnDataSuccess } = require('../services/successHandlers');
const { allError } = require('../services/errorHandlers');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const generateSendJWT = (res, statusCode, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_DAY,
  });
  user.password = undefined;
  res.status(statusCode).send({
    status: true,
    user: {
      token,
      id: user._id,
      name: user.name,
    },
  });
};
const usersController = {
  // 取得全部用戶資料
  async getUserAll(req, res, next) {
    /* 
      #swagger.tags = ['Users - 使用者']
    */
    // 時間排序
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const keyword =
      req.query.q !== undefined ? { name: new RegExp(req.query.q) } : {};
    const result = await User.find(keyword).sort(timeSort);
    returnDataSuccess(res, '成功取得全部資料', result);
  },
  // 創建用戶
  async singUp(req, res, next) {
    const dataFormFront = req.body;
    let { name, email, password, photo, passwordReset, gender } = req.body;
    if (!name || !email || !password || !passwordReset || !gender) {
      allError(400, '欄位未填寫正確', next);
    }
    if (!validator.isLength(password, { min: 8 })) {
      allError(400, '密碼字數低於8碼', next);
    }
    if (!validator.isEmail(email)) {
      allError(400, 'Email格式不正確', next);
    }
    secretPassword = await bcrypt.hash(password, 12);
    const result = await User.create({
      name: name,
      email: email,
      photo: photo,
      password: secretPassword,
      passwordReset: passwordReset,
      gender: gender,
    });
    generateSendJWT(res, 201, result);
  },
  async logIn(req, res, next) {
    const { email, password } = req.body;
    if(!email||!password){
      allError(400, '欄位未填寫完全', next);
    }
    if (!validator.isEmail(email)) {
      allError(400, 'Email格式不正確', next);
    }
    const result = await User.findOne({ email: email}).select('+password');
    console.log(result);
    const auth = await bcrypt.compare(password, result.password);
    if(!auth) {
      allError(400, '您的密碼錯誤', next);
    }
    generateSendJWT(res, 200, result);
  },
  checkName(req, res, next) {
    if (req.body.name.length > 0 || req.body.name !== undefined) {
      next();
    } else {
      allError(400, '用戶名稱尚未填寫', next);
    }
  },
  checkEmail(req, res, next) {
    var emailPat = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/; //true,說明email格式正確
    if (req.body.email.match(emailPat)) {
      next();
    } else {
      allError(400, 'Email尚未填寫或填寫不正確', next);
    }
  },
  checkPassword(req, res, next) {
    var checkNumber = /[0-9]/; //true,說明有數字
    var checkEnglish = /[a-z]/i; //true,說明有英文字母
    var checkChinese = new RegExp('[\\u4E00-\\u9FFF]+', 'g'); //true,說明有漢字
    if (checkChinese.test(req.body.password)) {
      allError(400, '密碼只能包含英文、數字', next);
    } else if (req.body.password.length === 0) {
      allError(400, '密碼尚未填寫', next);
    } else if (req.body.password.length < 8) {
      allError(400, '密碼少於8碼', next);
    } else if (
      checkNumber.test(req.body.password) === false ||
      checkEnglish.test(req.body.password) === false
    ) {
      allError(400, '密碼需要包含數字與英文', next);
    } else {
      next();
    }
  },
};

module.exports = usersController;
