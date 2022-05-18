const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const handleErrorAsync = require('../services/handleErrorAsync');
const usersController = require('../controllers/usersController');

// 取得全部 Post 資料
router.get('/all', handleErrorAsync(postsController.getPostAll));

// 取得特定 ID Post 資料
router.get('/:id', handleErrorAsync(postsController.getPost));

// 新增一筆資料
router.post(
  '/',
  handleErrorAsync(usersController.isAuth),
  postsController.checkPost,
  handleErrorAsync(postsController.newPost),
);

// 刪除全部 Post 資料
router.delete('/all', handleErrorAsync(postsController.deletePostAll));

// 刪除特定 ID Post 資料
router.delete('/:id', handleErrorAsync(postsController.deletePost));

module.exports = router;
