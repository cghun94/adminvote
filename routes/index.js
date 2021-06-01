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

const jwttoken  = require('./jwttoken');
const user = require("./user");

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

router.get('/access', jwttoken.accessToken);
router.get('/refresh', jwttoken.refreshToken);
router.get('/main', (req, res)=> {
    console.log(res);
    res.render('main');
});  

router.post('/login', user.login);


module.exports = router;