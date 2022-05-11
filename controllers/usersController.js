const User = require('../models/usersModel');
const { returnDataSuccess } = require('../services/successHandlers');
const { allError } = require('../services/errorHandlers');

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
  async newUser(req, res, next) {
    /* 
      #swagger.tags = ['Users - 使用者']
    */
    const dataFormFront = req.body;
    const result = await User.create({
      name: dataFormFront.name,
      email: dataFormFront.email,
      photo: dataFormFront.photo,
      password: dataFormFront.password,
      passwordReset: dataFormFront.passwordReset,
      gender: dataFormFront.gender,
    });
    returnDataSuccess(res, '成功創建用戶', result);
  },
  checkName(req, res, next) {
    if (req.body.name.length > 0 || req.body.name !== undefined) {
      next();
    } else {
      allError(400, '用戶名稱尚未填寫', next);
    }
  },
  checkEmail(req, res, next) {
    var emailPat = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;//true,說明email格式正確
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
