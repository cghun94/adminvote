require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const { render } = require('ejs');
const mysqlConn = mysqlconfig.init();
// mysqlconfig.open(mysqlConn); //연결 확인 successful.

module.exports = {
    getLog : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getLog 1')
                let refreshToken = jwt_token.checkToken(req,res);
                res.cookie("refreshToken" , refreshToken)
                .status(200).render('log');
            }
            else{
                console.log('getLog 2',req.headers.cookie)
                res.status(200).render('login');
            }    
        }catch(err){
            console.log('getLog 3',err)
            res.status(404).render('err');
        }
    },
    
    postLog : (req ,res) => {
        try{
            if(req.headers.cookie){
                console.log('postUserlist 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);

                mysqlConn.query(`SELECT * FROM Log ` ,function (err, logTable) {
                    // console.log(usersTable);
                    res.status(200).send(logTable);
                });

                
            }
            else{
                console.log('postUserlist 2',req.headers.cookie)
                res.status(200).render('login');
            }
        }catch(err){
            console.log('postUserlist 3',err)
            return res.status(404).render('error');
        }
    },
};