require('dotenv').config({path : '/root/admin/.env'});
const express = require('express');
const jwt_token= require('./token');
const bcrypt = require('bcrypt');

const mysqlconfig = require('./../config/mysql');
const { render } = require('ejs');
const mysqlConn = mysqlconfig.init();

module.exports = {
    getTradelist : (req, res) => {
        
        
        res.render('tradelist');
    },

    getAIP : (req, res) => {
        let decodedID= jwt_token.decoded(req,res);
        console.log(decodedID.id);
        res.render('coin/aip');
    },

    postAIP : (req, res) => {
        let decoded = jwt_token.decoded(req,res);
        let userid = decoded.id;
        // console.log('tradelist/aip ', req.body.buyAmount);
        // console.log('tradelist/aip ', req.body.coin);

        mysqlConn.query(`SELECT idx,id,name,KRW,created_at,updated_at FROM users where id = ? `,userid ,function (err, usersTable) {
            // console.log(usersTable);
            if(usersTable[0].KRW < req.body.buyAmount){
                res.status(400).json({
                    code : 400,
                    result : false,
                    message : "주문가능 금액을 초과하였습니다"
                });
            }
            else{
                //주문가능
                //aip코인이 있는지확인
                mysqlConn.query(`SELECT * FROM Asset where users_idx = ? `,usersTable[0].idx ,function (err, AssetTable) {
                    // console.log(AssetTable.length);
                    //없을떄 생성
                    if(AssetTable.length === 0){
                        let AfterBalance = req.body.buyAmount;                       
                        let params =[usersTable[0].idx ,req.body.coin , 0 ,req.body.buyQuantity ,req.body.NowPrice ,req.body.buyAmount,0, AfterBalance];                        
                        console.log(params)
                        mysqlConn.query(`insert into Asset(users_idx, CoinName, PrevBalance, Quantity , NowPrice , buyAmount ,Withdrawal,AfterBalance) values (?,?,?,?,?,?,?,?)  `,params);
                        console.log(usersTable[0].KRW - req.body.buyAmount );
                        let AfterKRW = usersTable[0].KRW - req.body.buyAmount;
                        let log =[usersTable[0].idx ,req.body.coin , 0 ,req.body.buyQuantity ,req.body.NowPrice ,req.body.buyAmount, 0, AfterBalance,usersTable[0].KRW , AfterKRW ]; 
                        mysqlConn.query(`insert into Log(users_idx, CoinName, PrevBalance, Quantity , NowPrice , buyAmount, Withdrawal ,AfterBalance,prevKRW ,AfterKRW) values (?,?,?,?,?,?,?,?,?,?)  `,log);

                        mysqlConn.query(`UPDATE users SET KRW = ? where idx = ?  `,[AfterKRW ,usersTable[0].idx]);                        
                    }
                    //있을떄
                    else{
                        // mysqlConn.query(`UPDATE users SET users where idx = ? and CoinName = ?`,[usersTable[0].idx,req.body.coin] ,function (err, usercoin) {

                        // });
                    }
                })//
            }
            // res.status(200).send(usersTable);
        });

        
    },

};