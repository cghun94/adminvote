require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');

module.exports = {
    index : (req , res ) => {
        if(req.headers.cookie){
            console.log('index 1',req.headers.cookie)
            jwt_token.checkToken(req,res);
            res.status(200).redirect('/main');
        }
        else{
            console.log('index 2',req.headers.cookie)
            res.status(200).render('login');
        }
    },
    
};