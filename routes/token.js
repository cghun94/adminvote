const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = {
    accessToken:(req , res ) =>{
        const token = req;
        console.log(token);
        // const token_body = token.split(' ')[1];
        // console.log(token_body);

        // jwt.verify(token_body, process.env.ACCESS_SECRET, (err, decoded) => {
        //     if (err) {
        //       res.status(400).send('invalid access token');
        //     } else {
        //         res.status(200).json({
        //             decoded                    
        //         });
        //     }
        // });
    }//accessToken end
}//module.exports end