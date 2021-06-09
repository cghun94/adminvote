require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
// mysqlconfig.open(mysqlConn); //연결 확인 successful.

module.exports = {
    getLogin : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getLogin 1',req.headers.cookie)
                jwt_token.checkToken(req,res);
                res.status(200).redirect('/main');
            }
            else{
                console.log('getLogin 2',req.headers.cookie)
                res.status(200).render('login');
            }
        }catch(err){
            console.log(err)
            return res.status(401).render('error');
        }      

        
    },

    postLogin : (req , res ) => {
        
        if(!req.headers.cookie){
            console.log('쿠키가 없을시');            
            if(req.body.id && req.body.password){
                //DB 에서 아이디찾기
                mysqlConn.query(`SELECT id FROM users where id = ?`, req.body.id ,function (err, db) {
                    //아이디 없을시
                    if(err){
                        console.log(err)
                        res.status(404).json({
                            code : 404,
                            message : "mysql err",
                            result : false
                        });
                    }                    
                    else if(db.length === 0){
                        res.status(400).json({
                            code : 400,
                            message : "아이디가 없습니다",
                            result : false
                        });
                    }
                    //아이디 존재
                    else{
                        //비번 비교
                        mysqlConn.query(`SELECT id , pw,idx FROM users where id = ?`, req.body.id ,function (err, db) {
                            //비번 존재
                            if(db[0].pw){
                                console.log('db0id ',db[0].id)                                
                                //비교
                                bcrypt.compare(req.body.password , db[0].pw , async(err , result) =>{
                                    if(result){
                                        console.log('result ',result);
                                        //비번일치                                        
                                        //로그인 관리자 맞은지 확인
                                        if(db[0].idx === 1){
                                            //jwt 토큰생성
                                            const accessToken = jwt_token.accessToken( db[0].id);
                                            const refreshToken = jwt_token.refreshToken( db[0].id);

                                            res.cookie("refreshToken" , refreshToken)
                                            .status(200)
                                            .json({
                                                code : 200,
                                                message : "관리자 로그인 성공",
                                                result : true,
                                                accessToken : accessToken
                                            })
                                        }
                                        else{
                                            res.status(400).json({
                                                code : 400,
                                                message : "관리자가 아닙니다",
                                                result : false
                                            });
                                        }
                                    }
                                    else{
                                        console.log('비번을 다시 입력해주세요',err)
                                        res.status(400).json({
                                            code : 400,
                                            message : "비번을 다시 입력해주세요",
                                            result : false
                                        });
                                    }
                                });

                                

                            }
                            //예외
                            else{
                                console.log(err)
                                res.status(404).json({
                                    code : 404,
                                    message : "mysql err",
                                    result : false
                                });
                            }
                            

                        });
                    }
                });//db 아이디찾기 end                
            }
            else{
                console.log('req.body id password 없음')
                res.status(400).json({
                    code : 400,
                    message : "아이디 또는 비번 입력을 안했습니다",
                    result : false
                });
            }
        }
        else{
            console.log('쿠키가 있음 -> 로그인페이지');
            res.status(200).redirect('login');
             }//쿠키 없을때 end

        
    },

    postLogout : (req, res ) => {
        try{
            res.clearCookie("refreshToken").send(req.headers.refreshToken);
        }catch(err){
            console.log(err)
            res.status(404).render('err');
        }       
    }
};