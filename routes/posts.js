const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const handleErrorAsync = require('../services/handleErrorAsync');
const usersController = require('../controllers/usersController');
const { isAuth, isLogin } = require('../services/authHandlers');

// 取得全部 Post 資料
router.get(
  '/all',
  handleErrorAsync(isLogin),
  handleErrorAsync(postsController.getPostAll),
);

// 取得特定 ID Post 資料
router.get(
  '/:id',
  handleErrorAsync(isLogin),
  handleErrorAsync(postsController.getPost),
);

// 新增一筆資料
router.post(
  '/',
  handleErrorAsync(isAuth),
  postsController.checkPost,
  handleErrorAsync(postsController.newPost),
);

// 刪除全部 Post 資料
router.delete('/all', handleErrorAsync(postsController.deletePostAll));

// 刪除特定 ID Post 資料
router.delete('/:id', handleErrorAsync(postsController.deletePost));

// 新增特定 ID Post喜歡
router.post(
  '/:id/likes',
  handleErrorAsync(isAuth),
  handleErrorAsync(postsController.addLikes),
);

// 刪除特定 ID Post喜歡
router.delete(
  '/:id/likes',
  handleErrorAsync(isAuth),
  handleErrorAsync(postsController.deleteLikes),
);


module.exports = router;
