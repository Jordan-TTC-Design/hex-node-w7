const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const multiparty = require('multiparty');

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
    console.error('重大錯誤', err);
    res.status(500).send({
      status: 'error',
      message: '請聯絡系統商'
    });
  }
};

const resErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

app.use(function (err, req, res, next) {
  // 開發者模式
  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }
  return resErrorProd(err, res);
});

process.on('uncaughtedException', (err) => {
  console.error('Uncaughted Exception!');
  console.error(err);
  process.exit(1);
});

process.on('unhandledREjection', (err, promise) => {
  console.error('未捕捉到的 rejection：', promise, '原因：', err);
});

module.exports = app;
