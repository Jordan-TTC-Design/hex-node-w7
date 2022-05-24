const express = require('express');
const router = express.Router();
const { allError } = require('../services/errorHandlers');
const handleErrorAsync = require('../services/handleErrorAsync');
const upload = require('../services/images');
const { ImgurClient } = require('imgur');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
// 上傳圖片
router.post(
  '/',
  upload,
  handleErrorAsync(async (req, res, next) => {
    //multer會把資料放到req.files
    if (!req.files.length) {
      return next(allError(400, '尚未上傳檔案', next));
    }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID,
    });
    res.status(200).send({
      status: 'success',
      imgUrl: response.data.link,
    });
  }),
);

module.exports = router;
