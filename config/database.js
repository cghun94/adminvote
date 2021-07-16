require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const mysqlConnection ={
    cgh : function(){
        return mysql.createPool({
            host: process.env.CGHHOST ,
            port : process.env.CGHLOCALPOST,
            user: process.env.CGHUSER,
            password: process.env.CGHPASSWORD,
            database: process.env.CGHDATABASE
        }).promise()
    },   

    api : function(){
        return mysql.createPool({
            host: '3.1.35.196' ,
            port : 3306,
            user: 'api',
            password: 'KOBEA@2021@',
            database: 'api'
        }).promise()
    },

}

module.exports = mysqlConnection;

