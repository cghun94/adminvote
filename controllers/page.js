require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const { render } = require('ejs');
const mysqlConn = mysqlconfig.init();
// mysqlconfig.open(mysqlConn); //연결 확인 successful.

module.exports = {
    getMain : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getMain 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);
                res.cookie("refreshToken" , refreshToken)
                .status(200).render('main');
            }
            else{
                console.log('getMain 2',req.headers.cookie)
                res.status(200).render('login');
            }    
        }catch(err){
            console.log('getMain 3',err)
                res.status(404).render('err');
        }
    },

    postHeader : (req,res) => {
        if(req.headers.cookie){            
            let decoded = jwt_token.decoded(req,res);
            let userid = decoded.id;
            console.log('postindex 1' ,userid)
            
            mysqlConn.query(`SELECT KRW FROM users where id = ? `,userid ,function (err, userkrw) {
                if(err){
                    res.status(400).json({
                        code : 400,
                        message : "mysql err"
                    });
                }else{
                    res.status(200).send(userkrw);
                }
                
            });
        }
        else{
            console.log('postindex 2',req.headers.cookie)
            res.status(200).render('login');
        }
    }, 

};