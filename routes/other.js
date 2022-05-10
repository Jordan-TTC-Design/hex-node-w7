const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const imgur = require('imgur-node-api');
const dotenv = require('dotenv');
const handleErrorAsync = require('../services/handleErrorAsync');
const { appError } = require('../services/errorHandlers');

dotenv.config({ path: './config.env' });
// 上傳圖片
router.post('/image',  handleErrorAsync(async (req, res, next) => {
  let form = new multiparty.Form();
  form.parse(req, async (err, fields, file) => {
    const imgFile = file.image[0];
    if (imgFile) {
      // 設定 app ID
      imgur.setClientID(process.env.IMGUR_TOKEN);
      // 取得檔案目錄，上傳至 imgur
      imgur.upload(imgFile.path, (err, image) => {
        console.log(image);
        if (err) {
            appError(400, err, next);
        } else {
          res
            .status(200)
            .send({
              status: true,
              data: image.data.link,
              message: '成功上傳圖片',
            })
            .end();
        }
      });
    } else {
        appError(400, '沒有選擇圖片', next);
    }
  });
}));

module.exports = router;
