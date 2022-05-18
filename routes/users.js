var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth,isAuthWithPassword } = require('../services/authHandlers');

// 取得全部user資料
router.get('/all', handleErrorAsync(usersController.getUserAll));

// 註冊
router.post(
  '/sign-up',
  usersController.checkName,
  usersController.checkEmail,
  usersController.checkPassword,
  handleErrorAsync(usersController.singUp),
);

// 登入
router.post(
  '/log-in',
  usersController.checkEmail,
  usersController.checkPassword,
  handleErrorAsync(usersController.logIn),
);

// 檢查登入
router.get(
  '/profile',
  handleErrorAsync(isAuth),
  handleErrorAsync(usersController.getMyPofile),
);

// 變更密碼
router.post(
  '/update-password',
  handleErrorAsync(isAuthWithPassword),
  usersController.checkOldPassword,
  usersController.isSamePassword,
  handleErrorAsync(usersController.updatePassword),
);

// 重設密碼
router.post(
  '/reset-password',
  handleErrorAsync(isAuth),
  handleErrorAsync(usersController.updatePassword),
);

module.exports = router;
