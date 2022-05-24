const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const {
  allSuccess,
  returnDataSuccess,
} = require('../services/successHandlers');
const { allError } = require('../services/errorHandlers');

const postsController = {
  // 取得全部 Post 資料
  async getPostAll(req, res, next) {
    // 時間排序
    const timeSort = req.query.timeSort == 'asc' ? 'createdAt' : '-createdAt';
    const keyword =
      req.query.q !== undefined ? { postContent: new RegExp(req.query.q) } : {};
    const result = await Post.find(keyword)
      .populate({
        path: 'user',
        select: 'name photo',
      })
      .sort(timeSort);
    if (req.user !== undefined) {
      result.isLogin = true;
    } else {
      result.isLogin = false;
    }
    returnDataSuccess(res, '成功取得全部資料', result);
  },
  // 取得特定 ID Post 資料
  async getPost(req, res, next) {
    const id = req.params.id;
    console.log(id)
    const result = await Post.find({ _id: id });
    console.log(result)
    if (req.user !== undefined) {
      result.isLogin = true;
    } else {
      result.isLogin = false;
    }
    if (result.length > 0) {
      returnDataSuccess(res, '成功取得該筆資料', result);
    } else {
      allError(400, '無該筆資料', next);
    }
  },
  // 新增一筆資料
  async newPost(req, res, next) {
    console.log(req.user.id);
    const dataFormFront = req.body;
    const result = await Post.create({
      user: req.user.id,
      postContent: dataFormFront.postContent,
      postImgUrl: dataFormFront.postImgUrl,
      postTags: dataFormFront.postTags,
    });
    returnDataSuccess(res, '成功新增一筆資料', result);
  },
  checkPostUser(req, res, next) {
    const dataFormFront = req.body;
    if (dataFormFront.user.length === 0) {
      allError(400, '尚未登入', next);
    } else {
      next();
    }
  },
  checkPost(req, res, next) {
    const dataFormFront = req.body;
    console.log(dataFormFront);
    if (
      dataFormFront.postContent.length === 0 &&
      dataFormFront.postImgUrl.length === 0
    ) {
      allError(400, '貼文內容和貼文圖片至少有一項須填寫', next);
    } else {
      next();
    }
  },
  // 刪除全部 Post 資料
  async deletePostAll(req, res, next) {
    await Post.deleteMany();
    allSuccess(res, '成功刪除全部資料');
  },
  // 刪除特定 ID Post 資料
  async deletePost(req, res, next) {
    const id = req.params.id;
    const result = await Post.deleteOne({ _id: id });
    if (result.deletedCount > 0) {
      allSuccess(res, '成功刪除該筆資料');
    } else {
      allError(400, '無該筆資料', next);
    }
  },
  async addLikes(req, res, next) {
    const _id = req.params.id;
    const result = await Post.findOneAndUpdate(
      { _id },
      { $addToSet: { postLikes: req.user.id } },
    );
    console.log(result)
    res.status(200).send({ 
      status: 'success',
      postId: _id,
      userId:req.user.id
    })
  },
  async deleteLikes(req, res, next) {
    const _id = req.params.id;
    const result = await Post.findOneAndUpdate(
      { _id },
      { $pull: { postLikes: req.user.id } },
    );
    console.log(result)
    res.status(201).send({ 
      status: 'success',
      postId: _id,
      userId:req.user.id
    })
  },
};

module.exports = postsController;
