const createError = require('http-errors');
const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');

//라우터 설정
var indexRouter = require('./routes/index');

app.use(logger('dev'));
//json request body 파싱 
app.use(express.json());
app.use(express.urlencoded( {extended : false } ));

// view 경로
app.set('views', __dirname+ '/views');
//ejs 파일 설정
app.set('view engine', 'ejs');

//기본 경로를 public로 설정 , css 가져오기
//__dirname 현재 기본경로에 + /public  = /admin/new_api_c/public
// __dirname 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없다. 
app.use(express.static(__dirname + '/public'));

// 404를 잡고 오류 처리
app.use(function(req, res, next) {
    next(createError(404));
});

app.use('/',indexRouter);

module.exports = app;