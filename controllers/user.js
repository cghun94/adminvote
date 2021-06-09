require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();

module.exports = {
    postSignupid : async(req , res ) => {
        // console.log(req.body.id)
        mysqlConn.query(`SELECT idx,id FROM users where id = ?` , [req.body.id] ,function (err, db, fields) {
            //db에서 아이디가 없다 ? => 가입을 할수있다 , axios로 아이디만 확인
            if(db.length === 0 ){
                console.log('아이디 없음');
                res.status(200).json( {
                    code : 200,
                    result : true,
                    message : '가입 가능한 아이디입니다'
                })
            }//if end
            else{
             console.log('아이디 있음');
             res.status(200).json( {
                 code : 200,
                 result : false,
                 message : '아이디 중복'
             })
            }
        });//mysql end
    },

    postSignuppw : async(req , res ) => {
        console.log(req.body.password)
        const password_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;
        //비밀번호 양식이 맞을떄
        if(password_check.test(req.body.password) === true ){
            console.log('비밀번호 양식 !');            
            res.status(200).json({
                result : true,
                message : '비밀번호 양호'
            })
        }//비밀번호 양식 if문
        //비밀번호 양식이 틀렸을때
        else{
            console.log('비밀번호 양식 틀림');
            res.status(400).json({
                result : false,
                message : '비밀번호 양식 틀림'
            })
        }//비밀번호 양식 else문              
    },

    postSignup : (req , res) => {
        const sql = 'INSERT INTO users(id, name, pw) VALUES (?, ?, ?)';
        const password_check = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/;

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
                    let body_hashpw =  bcrypt.hashSync(req.body.password,  process.env.salt);
                    let param = [req.body.id , req.body.name ,body_hashpw];

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
    },

};