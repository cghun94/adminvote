require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const router = express.Router();
const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
mysqlconfig.open(mysqlConn); //연결 확인 successful.
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {isLoggedIn, isNotLoggedIn,verifyToken}  = require('./token');
const session = require('express-session');



// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기

const salt = process.env.salt;  //만든 salt 저장하고 불러오기
console.log('salt : ' ,salt )
// jwt 시크릿키
const SECRET_KEY  = process.env.SECRET_KEY;
console.log('SECRET_KEY  : ', SECRET_KEY );


router.get('/', async (req, res ,next) => {
    try{
            res.render('login', {
                
            });
    }catch (err) {
        console.error(err);
        next(err);
    }
});

router.post('/token', async(req, res) => {
    const {clientSecret} = req.body;
    const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
        console.log('body_hash' , body_hashpw); //body 비밀번호 해시
    let db_hashpw,db_hashid;
    try{
        /*db 조회*/
        mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            if(db.length === 0 ){
                console.log('로그인 실패 아이디 없음');
                return  res.status(403).json({
                    code : 403,
                    message : '로그인 실패 아이디 없음'
                });
            }
            else{
                //*아이디 존재, 비밀번호 확인*/
                db_hashpw =  db[0].pw;
                db_hashid =  bcrypt.hashSync(db[0].id, salt);
                console.log('db_hash' , body_hashpw); //db 비밀번호 해시
                if( body_hashpw === db_hashpw ){
                    console.log('비번 ok , 로그인 성공');
                    const token_id = db_hashid;                    
                    //토큰 발급
                    const token   = jwt.sign({
                        //default : HMAC SHA256
                        id : token_id
                    },SECRET_KEY,{
                        expiresIn: '1m', // 만료시간 1m 1분 , 1h 시간 , 1s 초
                    });
                    console.log('jwtoken' , token);    
                        
                    req.session.jwt = token;// 토큰을 발급 받으면 tokenResult.data.token에 저장됨 그걸 세션에 토큰 저장(유효 기간 동안만)
                    const result = {
                        headers: { authorization: req.session.jwt }, //방금 발급 받은 후 세션에 넣었던 토큰을 header authorization에 넣어서 api 서버에 테스트 해보는거 -> v1.js으로 이동
                    };
                    return res.status(200).json({
                        code :  200,
                        message : '토큰이 발급 되었습니다',
                        token,
                        result,
                    });
                    
                    
                }
                else{
                    console.log('비번 false , 로그인 실패');
                    res.status(403).json({
                        code : 403,
                        message : '로그인 실패 비밀번호 틀림'
                    });
                }//if end 
            }//else end            
        });//db조회 end
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }//try catch end
});//post token end

router.get('/v1/test', verifyToken, (req, res) => { //토큰을 제대로 발급했는지 테스트해주는 라우터
    res.json(req.decoded);
  });


router.get('/test', async(req, res,next) => {
    console.log(req.session);
    try{
        //토큰이 없을때 토큰 발급 시도
        if(!req.session.jwt){
            const tokenResult = await axios.post('http://192.168.33.111:3000/token', {
                clientSecret : SECRET_KEY,
            });
            if(tokenResult.data && tokenResult.data.code === 200){
                //토큰 발급
                req.session.jwt = tokenResult.data.token;// 토큰을 발급 받으면 tokenResult.data.token에 저장됨 그걸 세션에 토큰 저장(유효 기간 동안만)
            }else{
                //토큰 발급 실패
                return res.json(tokenResult.data);
            }//if end
        }//if( !req.session.jwt ) end

        //토큰이 있을때  발급 받은 토큰테스트 
        const result = await axios.get('/v1/test',{
            headers: { authorization: req.session.jwt }, //방금 발급 받은 후 세션에 넣었던 토큰을 header authorization에 넣어서 api 서버에 테스트 해보는거 -> v1.js으로 이동
        });
        return res.json(result.data);
    }catch(error){
        console.error(error);
        if (error.response.status === 419) { // 토큰 만료 시
            return res.json(error.response.data);
        }
        return next(error);
    }//try catch end
});

router.post('/login', isNotLoggedIn ,(req, res, next) =>{
    const clientSecret = req.body;
    const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
        console.log('body_hash' , body_hashpw); //body 비밀번호 해시
        let db_hashpw,db_hashid;
    try{
        /*db 조회*/
        mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            if(db.length === 0 ){
                console.log('로그인 실패 아이디 없음');
                return  res.status(403).json({
                    code : 403,
                    message : '로그인 실패 아이디 없음'
                });
            }
            else{
                //*아이디 존재, 비밀번호 확인*/
                db_hashpw =  db[0].pw
                db_hashid =  bcrypt.hashSync(db[0].id, salt);
                console.log('db_hash' , body_hashpw); //db 비밀번호 해시
                if( body_hashpw === db_hashpw ){
                    console.log('비번 ok , 로그인 성공');
                    const token_id = db_hashid;                    
                    //토큰 발급
                    const token   = jwt.sign({
                        //default : HMAC SHA256
                        id : token_id
                    },SECRET_KEY,{
                        expiresIn: '1m', // 만료시간 1m 1분 , 1h 시간 , 1s 초
                    });
                    console.log('jwtoken' , token);    
                        

                    return res.status(200).json({
                        code :  200,
                        message : '토큰이 발급 되었습니다',
                        token,
                    });
                    
                    
                }
                else{
                    console.log('비번 false , 로그인 실패');
                    res.status(403).json({
                        code : 403,
                        message : '로그인 실패 비밀번호 틀림'
                    });
                }//if end 
            }//else end            
        });//db조회 end
    }catch(error){
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }//try catch end
});

router.get('/maintest', (req,res) => {
    res.render('main');
});
module.exports = router;