const express = require("express");
const jwt = require("jsonwebtoken");
require('dotenv').config({path : '/root/admin/.env'});
const bcrypt = require("bcrypt");
const salt = process.env.salt;  //만든 salt 저장하고 불러오기
const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
mysqlconfig.open(mysqlConn); //연결 확인 successful.

module.exports = {
    login: async(req ,res) =>{




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
                                
                                res
                                .cookie("refreshToken", refreshToken)
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
        console.log(req.headers.cookie.split(' '));
        let cokitoken = req.headers.cookie.split(' ')[0]
        let cookitoken = cokitoken.substring(cokitoken.indexOf('=')+1);
        console.log(cookitoken);
        
    }//login end
}