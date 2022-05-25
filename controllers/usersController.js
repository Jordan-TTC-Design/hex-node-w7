const User = require('../models/usersModel');
const Post = require('../models/postsModel');
const { returnDataSuccess } = require('../services/successHandlers');
const { allError } = require('../services/errorHandlers');
const { generateSendJWT } = require('../services/authHandlers');
const bcrypt = require('bcryptjs');
const validator = require('validator');

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
  async signUp(req, res, next) {
    let { name, email, password, photo, passwordReset, gender } = req.body;
    if (!name || !email || !password || !passwordReset || !gender) {
      allError(400, '欄位未填寫正確', next);
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
    generateSendJWT(res, 201, result, '註冊成功');
  },
  async updateUserData(req, res, next) {
    const { name, email, passwordReset, photo, gender } = req.body;
    if (!name || !gender) {
      allError(400, '資料未填寫完全', next);
    }
    if (!validator.isLength(name, { min: 1 })) {
      allError(400, '暱稱最少一個字元', next);
    }
    const result = await User.findByIdAndUpdate(req.user.id, {
      name,
      email,
      passwordReset,
      photo,
      gender,
    });
    returnDataSuccess(res, '成功變更用戶資料');
  },
  async logIn(req, res, next) {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email || !password) {
      allError(400, '欄位未填寫完全', next);
    }
    if (!validator.isEmail(email)) {
      allError(400, 'Email格式不正確', next);
    }
    const result = await User.findOne({ email: email }).select('+password');
    if (!result) {
      allError(400, '沒有此帳號', next);
    }
    const auth = await bcrypt.compare(password, result.password);
    if (!auth) {
      allError(400, '您的密碼錯誤', next);
    }
    generateSendJWT(res, 200, result, '登入成功');
  },
  getMyPofile(req, res, next) {
    const result = req.user;
    returnDataSuccess(res, '成功取得用戶資料', result);
  },
  async updatePassword(req, res, next) {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      allError(400, '密碼輸入不一致', next);
    }
    newPassword = await bcrypt.hash(password, 12);
    const result = await User.findByIdAndUpdate(req.user.id, {
      password: newPassword,
    });
    generateSendJWT(res, 200, result, '密碼變更成功');
  },
  async getLikesList(req, res, next) {
    const targetUserId = req.user.id;
    const likesList = await Post.find({
      'postLikes.userId': { $in: targetUserId },
    })
      .sort({
        'postLikes.time': -1,
      })
      .populate({
        path: 'postLikes',
        select: 'name _id photo',
      })
      .populate({
        path: 'postLikes',
        select: 'name _id photo',
      });
    res.status(200).send({
      status: 'success',
      likesList,
    });
  },
};
module.exports = usersController;
