const express = require('express');
const app = express();
const logger = require('morgan');
const bodyParser = require('body-parser');


//라우터 설정
var indexRouter = require('./routes/index');

app.use(logger('dev'));
//json request body 파싱 
app.use(express.json());
app.use(express.urlencoded( {extended : true } ));



// view 경로
app.set('views', __dirname+ '/views');
//ejs 파일 설정
app.set('view engine', 'ejs');

//기본 경로를 public로 설정 , css 가져오기
//__dirname 현재 기본경로에 + /public  = /admin/new_api_c/public
// __dirname 서버의 폴더 경로와 요청 경로가 다르므로 외부인이 서버의 구조를 쉽게 파악할 수 없다. 
app.use(express.static(__dirname + '/public'));
app.use(function(req, res, next) {

    //모든 도메인의 요청을 허용하지 않으면 웹브라우저에서 CORS 에러를 발생시킨다.
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
})
app.use('/',indexRouter);

module.exports = app;