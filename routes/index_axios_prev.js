// require('dotenv').config({path : '/root/admin/.env'});
// const express = require('express');
// const router = express.Router();
// const mysqlconfig = require('../config/mysql');
// const mysqlConn = mysqlconfig.init();
// mysqlconfig.open(mysqlConn); //연결 확인 successful.
// const bcrypt = require('bcrypt');

// const jwt = require('jsonwebtoken');
// const controller = require('./token');

// /*
// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기
// */
// const salt = process.env.salt;  //만든 salt 저장하고 불러오기
// console.log('salt : ' ,salt )
// // jwt 시크릿키
// const SECRET_KEY  = process.env.SECRET_KEY;
// console.log('SECRET_KEY  : ', SECRET_KEY );


// router.get('/', function (req, res) {
//     res.render('index');
// });

// router.get('/login', function (req, res) {
//     console.log('get 로그인 ');
//     res.render('login');
// });//get login end

// router.post('/login', function(req, res, next) {
//     let reqe = req;
//     let body = req.body;
//     let sql = `SELECT * FROM users where id = ?`;
//     console.log('body.id = ',body.id);
//     console.log('body.password = ',body.password);
//     let bodypw= body.password;
    
//     const body_hash = bcrypt.hashSync(bodypw, salt);
//     console.log('body_hash' , body_hash); //body 비밀번호 해시
//     let db_hash;
//     let param = [body.id];
    
//         //db 조회
//         mysqlConn.query(`SELECT * FROM users where id = ?` , [body.id] ,function (err, db, fields) {
//             if(db.length === 0 ){
//                 console.log('로그인 실패 아이디 없음');
//                 res.status(200).redirect('/login');
//             }
//             else{
//                 //아이디 존재, 비밀번호 확인
//                 db_hash =  bcrypt.hashSync(db[0].pw, salt);
//                 db_hashid =  bcrypt.hashSync(db[0].id, salt);
//                 console.log('db_hash' , db_hash); //db 비밀번호 해시
//                 if( body_hash === db_hash ){
//                     console.log('비번 ok , 로그인 성공');
//                     const token_id =db[0].id;
//                     let token = jwt.sign({
//                         //default : HMAC SHA256
//                         id : token_id
//                     },SECRET_KEY,{
//                         expiresIn: '1m', // 만료시간 5분
//                     },(err,token)=>{
//                         res.json({token})
//                     });
//                     // console.log('token' , token)
//                     // res.cookie('json', {id : token});
//                     // res.cookie('id', token);
//                     // req.session.valid = true;
//                     // res.redirect('/main');
//                     res.status(200).json({data :req })
                    
//                 }
//                 else{
//                     console.log('비번 틀림 , 로그인 실패');
//                     res.status(200).redirect('/login');
//                 }
//                 //if end 
//             }//else end
            
//         });//db조회 end 
        
// });//router.post end

// router.get('/main', function (req, res,next) {
//     console.log('get 로그인');
//     console.log('req ==', req.headers);
//     // console.log('req ==', req.headers.cookie.split(' '));
//     // let cooki = req.headers.cookie.split(' ');
//     // console.log('len' ,cooki.length );
//     // for(let i = )
//     res.render('main');
// });//get main end

// module.exports = router;