require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const router = express.Router();
const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
mysqlconfig.open(mysqlConn); //연결 확인 successful.
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const controller = require('./token');


// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기

const salt = process.env.salt;  //만든 salt 저장하고 불러오기
console.log('salt : ' ,salt )
// jwt 시크릿키
const SECRET_KEY  = process.env.SECRET_KEY;
console.log('SECRET_KEY  : ', SECRET_KEY );


router.get('/', function (req, res) {
    res.render('index');
});

router.get('/login', function (req, res) {
    console.log('get 로그인 ');
    res.render('login');
});//get login end

router.post('/login', function(req, res,next) {
    
    // console.log('reqe', req.body)
    // console.log('1body.id = ',req);
    let bodyid = req.body.id;
    let sql = `SELECT * FROM users where id = ?`;
    console.log('1body.id = ',req.body.id);
    console.log('1body.password = ',req.body.password);

    console.log('salt2 : ' ,salt )
    const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
    console.log('body_hash' , body_hashpw); //body 비밀번호 해시
    let db_hashpw;
    let param = [req.body.id];

        /*db 조회*/
        mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            if(db.length === 0 ){
                console.log('로그인 실패 아이디 없음');
                res.status(200).redirect('/login');
            }
            else{
                //*아이디 존재, 비밀번호 확인*/
                db_hashpw =  bcrypt.hashSync(db[0].pw, salt);
                db_hashid =  bcrypt.hashSync(db[0].id, salt);
                console.log('db_hash' , body_hashpw); //db 비밀번호 해시
                if( body_hashpw !== db_hashpw ){
                    console.log('비번 틀림 , 로그인 실패');
                    res.status(200).redirect('/login');
                    
                }
                else{
                    console.log('비번 ok , 로그인 성공');
                    const token_id = db_hashid;
                    
                    const accessToken  = jwt.sign({
                        //default : HMAC SHA256
                        id : token_id
                    },SECRET_KEY,{
                        expiresIn: '1m', // 만료시간 5분
                    });
                    console.log('jwtoken' , accessToken)    
                    // res.cookie('json', {id : token});
                    // res.cookie('id', token);
                    // req.session.valid = true;
                    // res.redirect('/main');
                                        

                    res.status(200).json({ Token : accessToken});
                }
                //if end 
            }//else end
            
        });//db조회 end
    
});//router.post end

router.get('/main', function (req, res,next) {
    console.log('get main  로그인');
    console.log('get main  req', req);
    // console.log('req ==', req.headers);
    // console.log('req ==', req.headers.cookie.split(' '));
    // let cooki = req.headers.cookie.split(' ');
    // console.log('len' ,cooki.length );
    // for(let i = )
    res.render('main');
});//get main end

module.exports = router;