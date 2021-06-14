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

    postBuy : (req, res) => {
        let decoded = jwt_token.decoded(req,res);
        let userid = decoded.id;
        // console.log('tradelist/aip ', req.body.buyAmount);
        // console.log('tradelist/aip ', req.body.coin);

        mysqlConn.query(`SELECT idx,id,name,KRW,created_at,updated_at FROM users where id = ? `,userid ,function (err, usersTable) {
            console.log( req.body.buyAmount);
            if( Number(req.body.buyAmount) === 0 || req.body.buyAmount === 'NaN'){
                res.status(200).json({
                    code : 200,
                    result : false,
                    message : "확인을 눌러 금액을 확인하세요"
                });
            }
            else if(usersTable[0].KRW < req.body.buyAmount){
                res.status(200).json({
                    code : 200,
                    result : false,
                    message : "주문가능 금액을 초과하였습니다"
                });
            }
            else{
                //주문가능
                //aip코인이 있는지확인
                mysqlConn.query(`SELECT * FROM Asset where users_idx = ? and  CoinName = ?`,[usersTable[0].idx, req.body.coin ],function (err, AssetTable) {
                    // console.log(AssetTable.length);
                    //없을떄 생성
                    let AfterKRW , log, Quantity, AfterQuantity;
                    if(AssetTable.length === 0){
                        //거래전 수량 -> 처음이면 0
                        Quantity = 0;
                        //거래후 수량  
                        AfterQuantity = Quantity + Number(req.body.buyQuantity);                       
                        AfterQuantity = Math.floor(AfterQuantity * 10000) /10000 ;  //업비트 소수점 4자리수 밑 내림

                        //거래 수량
                        tradeQuantity = Number(req.body.buyQuantity)
                        tradeQuantity = Math.floor(tradeQuantity * 10000) /10000 ;  //업비트 소수점 4자리수 밑 내림

                        //자산 코인 생성 sql values
                        let params =[usersTable[0].idx ,req.body.coin , Quantity ,tradeQuantity ,req.body.buyAmount,0, AfterQuantity];
                        
                        //자산 코인 생성
                        mysqlConn.query(`insert into Asset(users_idx, CoinName, Quantity, tradeQuantity ,  buyAmount ,Withdrawal,AfterQuantity) values (?,?,?,?,?,?,?)  `,params);
                        console.log(usersTable[0].KRW - req.body.buyAmount );
                        //로그 생성
                        AfterKRW = usersTable[0].KRW - req.body.buyAmount;
                        log =[usersTable[0].idx ,req.body.coin , Quantity , tradeQuantity ,req.body.NowPrice ,req.body.buyAmount, 0, AfterQuantity, usersTable[0].KRW , AfterKRW ]; 
                        mysqlConn.query(`insert into Log(users_idx, CoinName, Quantity, tradeQuantity , NowPrice , buyAmount, Withdrawal ,AfterQuantity,prevKRW ,AfterKRW) values (?,?,?,?,?,?,?,?,?,?)  `,log);

                        //거래후 남은 금액 업뎃
                        mysqlConn.query(`UPDATE users SET KRW = ? where idx = ?  `,[AfterKRW ,usersTable[0].idx]); 
                        
                        res.status(200).json({
                            code : 200,
                            result : true,
                            message : "코인 생성 후 거래 로그 등록 , 코인 업뎃"
                        });
                    }
                    //있을떄
                    else{
                        console.log('코인있음')
                        ////로그 등록
                        //거래전 수량
                        Quantity = Number(AssetTable[0].AfterQuantity);
                        Quantity = Math.floor(Quantity * 10000) /10000 ;//업비트 소수점 4자리수 밑 내림
                        //거래후 수량 
                        AfterQuantity = Quantity + Number(req.body.buyQuantity);
                        AfterQuantity = Math.floor(AfterQuantity * 10000) /10000 ;//업비트 소수점 4자리수 밑 내림
                        //거래 수량
                        tradeQuantity = Number(req.body.buyQuantity)
                        tradeQuantity = Math.floor(tradeQuantity * 10000) /10000 ;  //업비트 소수점 4자리수 밑 내림

                        console.log(AfterQuantity)
                        //거래후 원화 금액
                        AfterKRW = usersTable[0].KRW - req.body.buyAmount;
                         //          유저 번호           코인명         거래전 보유수량     거래 수량             현재 시세            매수금액           출금금액      거래후수량      , 거래전 원화        , 거래후 원화 
                        log =[usersTable[0].idx , req.body.coin ,   Quantity        ,tradeQuantity ,req.body.NowPrice ,req.body.buyAmount,    0,       AfterQuantity    , usersTable[0].KRW , AfterKRW ]; 
                        mysqlConn.query(`insert into Log(users_idx, CoinName, Quantity, tradeQuantity , NowPrice , buyAmount, Withdrawal ,AfterQuantity, prevKRW ,AfterKRW) values (?,?,?,?,?,?,?,?,?,?)  `,log);

                        //보유 자산 업뎃
                        console.log(usersTable[0].idx)

                        mysqlConn.query(`UPDATE Asset SET Quantity = ? ,tradeQuantity = ? , buyAmount = ? , AfterQuantity = ? where users_idx = ? and  CoinName = ? `,
                        [ Quantity , tradeQuantity, req.body.buyAmount ,AfterQuantity ,usersTable[0].idx ,req.body.coin ]);

                        //거래후 남은 금액 업뎃
                        mysqlConn.query(`UPDATE users SET KRW = ? where idx = ? `,[AfterKRW ,usersTable[0].idx]);

                        res.status(200).json({
                            code : 200,
                            result : true,
                            message : "로그 등록 후 코인 업뎃"
                        });
                    }
                })//
            }
            // res.status(200).send(usersTable);
        });

        
    },

    getKBH : (req, res)  => {
        let decodedID= jwt_token.decoded(req,res);
        console.log(decodedID.id);
        res.render('coin/kbh');
    },

};//module.exports end