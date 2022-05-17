const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const validator = require('validator');

//router
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const postsRouter = require('./routes/posts');
const otherRouter = require('./routes/other');
const swaggerUI = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

const app = express();

require('./connections/index');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/other', otherRouter);

const resErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      message: err.message,
    });
  } else {
    console.error('自訂義以外的錯誤', err);
    res.status(500).send({
      status: 'error',
      message: '請聯絡系統商',
    });
  }
};

// bcrypt.hash('tga5079', 12).then((res) => console.log(res));
// bcrypt
//   .compare(
//     'tga5079',
//     '$2a$12$po8Gu8YuLam8fh4EFF4L7u3EMPpSirbXU2nlv.W18K9JAEzhewzGm',
//   )
//   .then((res) => console.log(res));

const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack,
  });
  res.end();
};

app.use(function (err, req, res, next) {
  err.statusCode = err.statusCode || 500;
  // 開發者模式
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  return resErrorProd(err, res);
});

process.on('uncaughtedException', (err) => {
  console.error('Uncaughted Exception!');
  console.error(err);
  // exit code 0 表示程式執行正常，正常退出程式執行序
  // exit code 1 表示程式執行過程遇到某些問題或錯誤，非正常退出執行
  process.exit(1);
});

process.on('unhandledREjection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

app.use(function (req, res, next) {
  res.status(404).send({
    status: false,
    statusCode: 404,
    message: '抱歉，畫面找不到',
  });
});

module.exports = app;
