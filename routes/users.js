var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const handleErrorAsync = require('../services/handleErrorAsync');
const { isAuth, isAuthWithPassword } = require('../services/authHandlers');

// 取得全部user資料
router.get('/all', handleErrorAsync(usersController.getUserAll));

// 註冊
router.post(
  '/sign-up',
  usersController.checkName,
  usersController.checkEmail,
  usersController.checkPassword,
  handleErrorAsync(usersController.signUp),
);

// 登入
router.post(
  '/log-in',
  usersController.checkEmail,
  usersController.checkPassword,
  handleErrorAsync(usersController.logIn),
);

// 取得個人資料
router.get(
  '/profile',
  handleErrorAsync(isAuth),
  handleErrorAsync(usersController.getMyPofile),
);
// 取得個人資料
router.patch(
  '/profile',
  handleErrorAsync(isAuth),
  handleErrorAsync(usersController.updateUserData),
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

router.get(
  '/get-likes-list',
  handleErrorAsync(isAuth),
  handleErrorAsync(usersController.getLikesList),
);

module.exports = router;
