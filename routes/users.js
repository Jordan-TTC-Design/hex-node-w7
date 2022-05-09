var express = require('express');
var router = express.Router();
const usersController = require('../controllers/usersController');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 取得全部user資料
router.get('/all', usersController.getUserAll);
// 創建user
router.post('/new', usersController.newUser);

module.exports = router;
