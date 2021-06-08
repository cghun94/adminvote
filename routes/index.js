require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const router = express.Router();
const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
mysqlconfig.open(mysqlConn); //연결 확인 successful.
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const axios = require('axios');
const session = require('express-session');
const cookie = require('cookie');
const jwt_token= require('./token');

// let saltRounds = Number(process.env.saltRounds);//salt 를 만들기 위해 몇번 돌릴지 정했다
// console.log('saltRounds = ', saltRounds); //몇번돌렸는지 확인
// const salt = bcrypt.genSaltSync(saltRounds); //salt 만들기

const salt = process.env.salt;  //만든 salt 저장하고 불러오기
// console.log('salt : ' ,salt )

router.get('/', async (req, res ,next) => {
    try{
        if(req.headers.cookie){
            jwt_token.checkToken(req,res,req);
            console.log('/ = ',jwt_token.checkToken(req,res,req))
            try{
                res.redirect('/main');
            }catch (err) {
                console.error(err);
                next(err);
                res.render('login');
            }
        }
        else{
            res.render('login');
        }
        
    }catch(err){
        console.log(err.message);
    }
    
});


router.post('/login', async(req ,res) =>{
    try{
        const {id , password } = req.body;
        const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
        console.log('비번 해쉬 ', body_hashpw)
        if(process.env.admin_id === req.body.id ){
            console.log('아이디 존재');
            if(body_hashpw === process.env.admin_pw ){
                console.log('비번 ok , 로그인 성공');
                const accessToken = jwt_token.login( process.env.admin_id ,res);
                // console.log('비번 ok , 로그인 성공2',accessToken);
                let second = 1000; //쿠키 만료시간 초

                res.cookie("accessToken", accessToken ,{maxAge: 5 *second })
                .status(200)
                .send({accessToken: accessToken })
                                                   
                            
            }//if end
            else{
                res.status(401).send({
                    result : 'pw false',
                    message : '비밀번호 틀림'
                });
            }
        }// if id
        else{
            console.log('로그인 실패 아이디 없음');
                res.status(400).send({
                    result : 'id false',
                    message : '아이디 없음'
                });
        }
        
    }catch(error){
        console.log(error);
    }//try catch end
    
}); //login end

router.get('/main' , (req, res,next)=> {
    if(req.headers.cookie){
        let refreshToken = jwt_token.checkToken(req,res);
        let second = 1000; //쿠키 만료시간 초
            // console.log('재발급 = ',refreshToken);
        res.cookie("accessToken", refreshToken ,{maxAge:  2 * 60  *second })
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

router.get('/userlist' , (req, res,next)=> {
    if(req.headers.cookie){
        if(jwt_token.checkToken(req,res)){
            let refreshToken = jwt_token.checkToken(req,res);
            let second = 1000; //쿠키 만료시간 초
            // console.log('재발급 = ',refreshToken);

            res.cookie("accessToken", refreshToken ,{maxAge: 2 * 60 *second })
            .status(200)
            .render('userlist');
        }        
        
        
    }
    else{
        res.redirect('/');
    }   
});

router.post('/userlist' , (req, res,next)=> {
    if(req.headers.cookie){
        let refreshToken = jwt_token.checkToken(req,res);
        let second = 1000; //쿠키 만료시간 초
       
        mysqlConn.query(`SELECT idx,id,name,created_at FROM users ` ,function (err, usersTable) {
            
            console.log('userlist data ',usersTable);
            res.cookie("accessToken", refreshToken ,{maxAge:  2 * 60  *second })
            .status(200)
            .send(usersTable)
        });

        ;
    }
    else{
        res.redirect('/');        
    }   
});


router.get('/signup' , (req, res,next)=> {   
    // let sql = 'INSERT INTO posts (id, name, pw) VALUES (?, ?, ?)';
    //let param = [req.body.id , req.body.password];
    res.render('signup')
});

router.post('/signup' , async(req, res,next)=> {   
    try{
        const password_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        
        const body_hashpw =  bcrypt.hashSync(req.body.password, salt);
        // console.log('비번 해쉬 ', body_hashpw)
        let sql = 'INSERT INTO users(id, name, pw) VALUES (?, ?, ?)';
        let param = [req.body.id , req.body.name ,body_hashpw];
        
        //post man 
        mysqlConn.query( 'SELECT idx,id,name,created_at FROM users where id = ?' , req.body.id ,function (err, db, fields) {
            //err 랑 성공했을때 확인
            console.log(db.length);
            if(db === undefined || db.length === 0){
                console.log('아이디 없음');
                //아이디가 없을떄 생성
                console.log(req.body.password)
                console.log(password_check.test(req.body.password));
                //비밀번호 양식이 맞을떄
                if(password_check.test(req.body.password) === true ){
                    console.log('아이디 생성1');

                    mysqlConn.query( sql , param ) ;
                    res.status(200).json({
                        result : true,
                        message : '유저 생성 성공'
                    })
                }//비밀번호 양식 if문
                //비밀번호 양식이 틀렸을때
                else{
                    res.status(400).json({
                        result : false,
                        message : '비밀번호 양식 틀림'
                    })
                }//비밀번호 양식 else문              
                     
            }//아이디 if문
            else{
                console.log('아이디 있음');
                console.log(db)
                res.status(400).json({
                    result : false,
                    message : '아이디 존재'
                })
            }//아이디 else문
        });//id 체크 sql문
    }catch(error){
        console.log(error);
        res.status(404).json({
            result : false,
            message : '404'
        })
    }//try catch end

});


router.post('/signup_id' , async(req, res,next)=> {
       console.log(req.body.id);
       ////////mysql 문
       mysqlConn.query(`SELECT * FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
           //db에서 아이디가 없다 ? => 가입을 할수있다 , axios로 아이디만 확인
           if(db.length === 0 ){
               console.log('아이디 없음');
               res.status(200).json( {
                   result : true,
                   message : '가입 가능한 아이디입니다'
               })
           }//if end
           else{
            console.log('아이디 있음');
            res.status(200).json( {
                result : false,
                message : '아이디 중복'
            })
           }
       });//mysql end
});

router.post('/delete' , async(req, res,next)=> {
    console.log(req.body.idx);
    ////////mysql 문
    mysqlConn.query(`DELETE FROM users WHERE idx = ?` , [req.body.idx] ,function (err, db, fields) {
        if(err){
            console.log(err);
            res.status(404).json({
                result : false,
                message : 'mysql err'
            })
        }
        else{
            console.log('삭제성공');
            res.status(200).json({
                result : true,
                message : '삭제성공'
            })
        }
    });//mysql end
});

router.get('/aip' , (req, res,next)=> {
    if(req.headers.cookie){
        let refreshToken = jwt_token.checkToken(req,res);
        let second = 1000; //쿠키 만료시간 초

        res.cookie("accessToken", refreshToken ,{maxAge:  2 * 60  *second })
        .status(200)
        .render('aip')
       

       
    }
    else{
        res.redirect('/');        
    }   
});

router.post('/aip' , (req, res,next)=> {
    if(req.headers.cookie){
        let refreshToken = jwt_token.checkToken(req,res);
        let second = 1000; //쿠키 만료시간 초
       
        mysqlConn.query(`SELECT * FROM AIP ` ,function (err, aipTable) {
            
            console.log('userlist data ',aipTable);
            res.cookie("accessToken", refreshToken ,{maxAge:  2 * 60  *second })
            .status(200)
            .send(aipTable)
        });

        ;
    }
    else{
        res.redirect('/');        
    }   
});
module.exports = router;