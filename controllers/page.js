require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const mysqlConn = mysqlconfig.init();
// mysqlconfig.open(mysqlConn); //연결 확인 successful.

module.exports = {
    getMain : (req , res ) => {
        res.status(200).render('main');
    },

    getSignup : (req , res ) => {
        res.status(200).render('signup');
    },

    getUserlist : (req , res ) => {
        res.status(200).render('userlist');
    },

    postUserlist : (req , res ) => {
        try{
            
        }catch(err){
            console.log(err)
            return res.status(404).render('error');
        }
    },


};