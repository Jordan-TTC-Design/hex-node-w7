const User = require('../models/usersModel');
const {
  allSuccess,
  returnDataSuccess,
} = require('../services/successHandlers');
const { allError } = require('../services/errorHandlers');
const usersController = {
  // 取得全部用戶資料
  async getUserAll(req, res, next) {
    /* 
      #swagger.tags = ['Users - 使用者']
    */
    try {
      // 時間排序
      const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
      const keyword =
        req.query.q !== undefined
          ? { name: new RegExp(req.query.q) }
          : {};
      const result = await User.find(keyword).sort(timeSort);
      returnDataSuccess(res, '成功取得全部資料', result);
    } catch (err) {
      allError(400, res, err);
    }
  },
  // 創建用戶
  async newUser(req, res, next) {
    /* 
      #swagger.tags = ['Users - 使用者']
    */
    try {
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
    } catch (err) {
      allError(400, res, err);
    }
  },
};

module.exports = usersController;
