var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');
const handleErrorAsync = require('../services/handleErrorAsync');

// 取得全部user資料
router.get('/all', handleErrorAsync(usersController.getUserAll));
// 創建user
router.post(
  '/new',
  usersController.checkName,
  usersController.checkEmail,
  usersController.checkPassword,
  handleErrorAsync(usersController.newUser),
);

module.exports = router;
