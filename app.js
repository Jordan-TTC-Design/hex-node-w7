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
const swaggerFile = require('./swagger-output.json')

const app = express();

require('./connections/index')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerFile))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/other', otherRouter);

module.exports = app;
