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
const session = require('express-session');
const cookie = require('cookie');
const jwt_token= require('./token');

// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기

const salt = process.env.salt;  //만든 salt 저장하고 불러오기
// console.log('salt : ' ,salt )



router.get('/', async (req, res ,next) => {
    if(req.headers.cookie){
        jwt_token.checkToken(req,res,req);
        try{
            res.redirect('/main');
        }catch (err) {
            console.error(err);
            next(err);
        }
    }
    else{
        res.render('login');
    }
    
});


router.post('/login', async(req ,res) =>{
    try{
        const {id , password } = req.body;
        const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
        mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            if(db.length === 0 ){
                console.log('로그인 실패 아이디 없음');
                res.status(400).send({
                    code : 400,
                    message : '로그인 실패 아이디 없음'
                });
            }//if end
            else{                
                if(body_hashpw === db[0].pw ){
                    console.log('비번 ok , 로그인 성공');
                    const accessToken = jwt_token.login( db[0].id ,res);
                    // console.log('비번 ok , 로그인 성공2',accessToken);
                    let second = 1000; //쿠키 만료시간 초

                    res.cookie("accessToken", accessToken ,{maxAge: 5 *second })
                    .status(200)
                    .send({accessToken: accessToken })
                                                       
                                
                }//if end
                else{
                    res.status(400).send('비밀번호 틀림');
                }
            }
        });//mysql end
    }catch(error){
        console.log(error);
    }//try catch end
    
    
}); //login end

router.get('/main' , (req, res,next)=> {
    if(req.headers.cookie){
        let refreshToken = jwt_token.checkToken(req,res);
        let second = 1000; //쿠키 만료시간 초
            // console.log('재발급 = ',refreshToken);
        res.cookie("accessToken", refreshToken ,{maxAge: 100 *second })
        .status(200)
        .render('main');
    }
    else{
        res.redirect('/');
    }   
});

router.post('/logout', async(req,res)=>{
    console.log('로그아웃1')
    if(req.headers.cookie === undefined){
        return res.status(401).send('토큰없음')
    }    
    jwt_token.logout(req,res);
});
module.exports = router;