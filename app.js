const createError = require('http-errors');
const express = require('express');
const app = express();
const logger = require('morgan');

//라우터 설정
var indexRouter = require('./routes/index');






app.use('/',indexRouter);

module.exports = app;