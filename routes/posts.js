const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const handleErrorAsync = require('../services/handleErrorAsync');

const {
  allSuccess,
  returnDataSuccess,
} = require('../services/successHandlers');

const checkKeyWords = function (req, res, next) {
  if (req.query.q) {
    next();
  } else {
    allError(400, res, '您未輸入關鍵字');
  }
};

// 取得全部 Post 資料
router.get('/all', postsController.getPostAll);

// 取得特定 ID Post 資料
router.get('/:id', postsController.getPost);

router.get('/search', checkKeyWords, function (req, res, next) {
  allSuccess(res, `您搜尋的關鍵字是${req.query.q}`);
});

// 新增一筆資料
router.post('/', postsController.newPost);

// 刪除全部 Post 資料
router.delete('/all', postsController.deletePostAll);

// 刪除特定 ID Post 資料
router.delete('/:id', handleErrorAsync(postsController.deletePost));

module.exports = router;
