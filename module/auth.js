require('dotenv').config();
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
/**
 * 쿠키 확인
 */

function cookieCk(req){
    let cookiesToken=null;
    if(req.headers.cookie){
        cookiesToken = cookie.parse(req.headers.cookie);
        cookiesToken = cookiesToken.Token;
        // console.log(cookiesToken);    
    }
    return cookiesToken;
}

module.exports = {
    reqbodyCheck : (req,res,next) => {
        let body = req.body; 
        for(let prop in body){
            if(body[prop] === ''){
                return res.status(400)
                .json({
                    code : 400,
                    message : '이메일과 비밀번호를 입력해주세요',
                    result : false
                })
                
            }         
        }
        next();
    },   
    /**
     * cookie 확인
     */
    cookieCheck : (req ,res, next) => {
        if(cookieCk(req)){
            console.log('cookieCheck 쿠키 존재')
            next();
        }
        console.log('cookieCheck 쿠키 x')
        next();
    },
    /**
     * jwt 생성
     * accessToken(로그인 email)
     */
    accessToken : (req , res ,email) => {
        //쿠키 검사후 
        if(cookieCk(req)){

        }
        
        let token = jwt.sign(
            {id : email} ,
                process.env.SECRET_KEY,
            {
                expiresIn: "1m" , 
            }
        );
        return res.cookie('Token' , token).status(200).json({
            code : 200,
            message : "관리자 로그인 성공",
            result : true,
            Token : token
        })
    },
    /**
     * jwt 검증 ,재발급
     */
    checkToken : (req ,res, next) => {
        console.log(cookieCk(req));
        if(cookieCk(req) === undefined){
            console.log('checkToken 1')                
        }
        
        console.log('checkToken 쿠키 x')
        
    },


}

