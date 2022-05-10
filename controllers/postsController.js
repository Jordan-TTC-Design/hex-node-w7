const Post = require('../models/postsModel');
const User = require('../models/usersModel');
const {
  allSuccess,
  returnDataSuccess,
} = require('../services/successHandlers');
const { allError, appError } = require('../services/errorHandlers');
const postsController = {
  // 取得全部 Post 資料
  async getPostAll(req, res, next) {
    /* 
      #swagger.tags = ['Posts - 貼文']
      #swagger.description = '取得全部 Post 資料'
      #swagger.response[200] ={
        description:'貼文資訊', 
        schema:{
          "status":true,
          "data":[{}]
        }
      }
    */
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
    returnDataSuccess(res, '成功取得全部資料', result);
  },
  // 取得特定 ID Post 資料
  async getPost(req, res, next) {
    /* 
      #swagger.tags = ['Posts - 貼文']
      #swagger.description = '取得特定 ID Post 資料'
    */
    const id = req.params.id;
    try {
      const result = await Post.find({ _id: id });
      if (result.length > 0) {
        returnDataSuccess(res, '成功取得該筆資料', result);
      } else {
        allError(400, res, '無該筆資料');
      }
    } catch (err) {
      allError(400, res, err);
    }
  },
  // 新增一筆資料
  async newPost(req, res, next) {
    /* 
      #swagger.tags = ['Posts - 貼文']
    */
    const dataFormFront = req.body;
    if (
      dataFormFront.postContent.length === 0 &&
      dataFormFront.postImgUrl.length === 0
    ) {
      appError(400, '貼文內容和貼文圖片至少有一項須填寫', next);
    } else {
      const result = await Post.create({
        user: dataFormFront.user,
        postContent: dataFormFront.postContent,
        postImgUrl: dataFormFront.postImgUrl,
        postTags: dataFormFront.postTags,
      });
      returnDataSuccess(res, '成功新增一筆資料', result);
    }
  },
  // 刪除全部 Post 資料
  async deletePostAll(req, res, next) {
    try {
      await Post.deleteMany();
      allSuccess(res, '成功刪除全部資料');
    } catch (err) {
      allError(400, res, err);
    }
  },
  // 刪除特定 ID Post 資料
  async deletePost(req, res, next) {
      const id = req.params.id;
      const result = await Post.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        allSuccess(res, '成功刪除該筆資料');
      } else {
        allError(400, res, '無該筆資料');
      }
  },
};

module.exports = postsController;
