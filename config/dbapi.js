require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');

const mysqlConnection ={
    api : function(){
        return mysql.createPool({
            host: '3.1.35.196' ,
            port : 3306,
            user: 'api',
            password: 'KOBEA@2021@',
            database: 'api'
        }).promise()
    },

    init: function () {
        return mysql.createConnection({
            host: '3.1.35.196',
            post: 3306,
            user: 'api',
            password: 'KOBEA@2021@',
            database: 'api'
        });
    },

}

module.exports = mysqlConnection;

