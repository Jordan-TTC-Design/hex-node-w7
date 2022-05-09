const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');

// 取得全部 Post 資料
router.get('/all', postsController.getPostAll);

// 取得特定 ID Post 資料
router.get('/:id', postsController.getPost);

// 新增一筆資料
router.post('/', postsController.newPost);

// 刪除全部 Post 資料
router.delete('/all',postsController.deletePostAll);

// 刪除特定 ID Post 資料
router.delete('/:id', postsController.deletePost);


module.exports = router;
