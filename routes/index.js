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
const session = require('express-session');
const cookie = require('cookie');

// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기

const salt = process.env.salt;  //만든 salt 저장하고 불러오기
console.log('salt : ' ,salt )
// jwt 시크릿키
const SECRET_KEY  = process.env.SECRET_KEY;
console.log('SECRET_KEY  : ', SECRET_KEY );


router.get('/', async (req, res ,next) => {
    // console.log(req.headers);
    try{
            res.render('login', {
                
            });
    }catch (err) {
        console.error(err);
        next(err);
    }
});

// router.get('/access', jwttoken.accessToken);
// router.get('/refresh', jwttoken.refreshToken);


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
                    
                            const accessToken = jwt.sign(
                                {id: db[0].id},
                                process.env.ACCESS_SECRET,
                                {
                                expiresIn: "1m",
                                }
                            );
        
                            const refreshToken = jwt.sign(
                                {id :db[0].id},
                                process.env.REFRESH_SECRET,
                                {
                                expiresIn: "1m",
                                }
                            );
                            let second = 1000;
                            console.log(4 * second);
                            res
                            .cookie("refreshToken", refreshToken ,{maxAge: 5 *second })
                            .status(200)
                            .json({token: accessToken })
                                                       
                                
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

const checkToken = (token, res, next) => {
    
    if(token === undefined){
        return res.status(401).send('error is not present')
    }
    
    if(token){
        jwt.verify(token,SECRET_KEY , (err , decoded) => {
            if(err){
                return res.json({
                    success:  false,
                    message : '토큰이 유효하지 않음'
                });
            }
            else{
                    resdecoded = decoded;
                    next();
                
            }
        });
    }
    else{
        return res.json({
            success:  false,
            message : '토큰없음'
        });
    }
}

router.get('/main' , (req, res)=> {
    if(req.headers.cookie){
        let cookies_token = cookie.parse(req.headers.cookie);
        cookies_token = cookies_token.refreshToken;
        console.log('메인겟' , cookies_token);

    }
    else{
        res.redirect('/');
    }
    
    
    
    res.render('main');
});  


router.post('/main' , checkToken , (req, res)=> {
    console.log(req.headers);
    // jwt.verify(req.token)
    res.render('main');
});  
module.exports = router;