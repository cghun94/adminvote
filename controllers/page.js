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

    getSignup : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getSignup 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);
                res.cookie("refreshToken" , refreshToken)
                .status(200).render('signup');
            }
            else{
                console.log('getSignup 2',req.headers.cookie)
                res.status(200).render('login');
            }    
        }catch(err){
            console.log('getSignup 3',err)
            res.status(404).render('err');
        }
    },

    getUserlist : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getUserlist 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);
                res.cookie("refreshToken" , refreshToken)
                .status(200).render('userlist');
            }
            else{
                console.log('getUserlist 2',req.headers.cookie)
                res.status(200).render('login');
            }    
        }catch(err){
            console.log('getUserlist 3',err)
            res.status(404).render('err');
        }
    },
    
    postUserlist : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('postUserlist 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);

                mysqlConn.query(`SELECT idx,id,name,created_at,updated_at FROM users ` ,function (err, usersTable) {
                    // console.log(usersTable);
                    res.cookie("refreshToken" , refreshToken)
                    .status(200).send(usersTable);
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

    postUserdelete : (req , res) => {
        try{
            if(req.headers.cookie){
                console.log('postUserdelete 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);

                mysqlConn.query(`DELETE FROM users WHERE idx = ?` , [req.body.idx] ,function (err, db, fields) {
                    if(err){
                        console.log(err);
                        res.status(404).json({
                            code : 404,
                            result : false,
                            message : 'mysql err'
                        })
                    }
                    else{
                        console.log('삭제성공');
                        res.cookie("refreshToken" , refreshToken)
                        .status(200).json({
                            code : 200 ,
                            result : true,
                            message : '삭제성공'
                        })
                    }
                });
                
            }
            else{
                console.log('postUserdelete 2',req.headers.cookie)
                res.status(200).render('login');
            }
        }catch(err){
            console.log('postUserdelete 3',err)
            return res.status(404).render('error');
        }
        
    },

    getUserinfo : (req , res ) => {
        try{
            if(req.headers.cookie){
                console.log('getUserinfo 1',req.headers.cookie)
                let refreshToken = jwt_token.checkToken(req,res);
                res.cookie("refreshToken" , refreshToken)
                .status(200).render('userinfo');
            }
            else{
                console.log('getUserinfo 2',req.headers.cookie)
                res.status(200).render('login');
            }    
        }catch(err){
            console.log('getUserinfo 3',err)
            res.status(404).render('err');
        }
    },
    // getUserinfoidx : (req , res ) => {
    //     console.log(req)
    //     // res.render('userinfo')
    // },
    postUserinfo : (req , res ) => {
        console.log('postuserinfo idx ', req.body.idx)
        
    },

    postUserinfoAIP : async(req , res ) => {
        console.log('postUserinfoAIP idx ', req.body.usersidx)
        // let idx = 1 ;
        mysqlConn.query(`SELECT * FROM AIP where users_idx = ?  `, req.body.usersidx ,function (err, aipTable) {
            // console.log(aipTable);
            res.status(200).send(aipTable);
        });        
    },
};