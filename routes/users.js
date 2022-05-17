var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const handleErrorAsync = require('../services/handleErrorAsync');

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


module.exports = router;
