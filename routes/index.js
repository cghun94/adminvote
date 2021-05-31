require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const router = express.Router();
const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
mysqlconfig.open(mysqlConn); //연결 확인 successful.
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');

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

router.get('/loginpage', async(req, res,next)=> {
    console.log('get loginpage req로그인 ' );
    
    // res.render('loginpage');
});//get login end

router.get('/login', verifyToken, function (req, res) {
    console.log('get 로그인 ');
    jwt.verify(req.token ,SECRET_KEY , (err, Data)=> {
        if(err){
            res.sendStatus(403);
        }else{
            res.json({ message : '토큰 로그인 성공' , Data});
        }
    });
});//get login end

router.post('/login', async(req, res)=> {
    
    // console.log('req == ', req);
    // console.log('1body.id = ',req);
    let bodyid = req.body.id;
    let sql = `SELECT * FROM users where id = ?`;
    console.log('라우터 포스트 body.id = ',req.body.id);
    console.log('라우터 포스트 body.password = ',req.body.password);

    console.log('salt2 : ' ,salt )
    const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
    console.log('body_hash' , body_hashpw); //body 비밀번호 해시
    let db_hashpw;
    let param = [req.body.id];

        /*db 조회*/
        mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            if(db.length === 0 ){
                console.log('로그인 실패 아이디 없음');
                res.json({result : false});
            }
            else{
                //*아이디 존재, 비밀번호 확인*/
                db_hashpw =  bcrypt.hashSync(db[0].pw, salt);
                db_hashid =  bcrypt.hashSync(db[0].id, salt);
                console.log('db_hash' , body_hashpw); //db 비밀번호 해시
                if( body_hashpw === db_hashpw ){
                    console.log('비번 ok , 로그인 성공');
                    const token_id = db_hashid;
                    
                    const accessToken  = jwt.sign({
                        //default : HMAC SHA256
                        id : token_id
                    },SECRET_KEY,{
                        expiresIn: '1m', // 만료시간 5분
                    });
                    console.log('jwtoken' , accessToken)    
                        

                    res.status(200).json({result : true , Token : accessToken});
                    
                    
                }
                else{
                    res.status(200).json({result : false});
                }
                //if end 
            }//else end
            
        });//db조회 end
    
});//router.post end

router.get('/main', function (req, res) {
    console.log('get main  로그인' , res);
    

    res.render('main');
});//get main end

//jwt 토큰 확인 함수
function verifyToken(req, res, next){
    //헤더값이므로 토큰을 보낼떄 헤더로 보내야한다
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        
        req.token = bearerToken;
        // 다음 미들웨어 실행
        next();
    }else{
        res.sendStatus(403);
    }
}


module.exports = router;