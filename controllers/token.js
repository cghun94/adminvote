require('dotenv').config({path : '/root/admin/.env'});
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = {
    accessToken : (req) => {
        return jwt.sign(
            {req} ,
                process.env.ACCESS_SECRET,
            {
                expiresIn: "5s", //토큰 확인을 위해 5초 , 프로젝트 완료시 1m 바꾸기
            }
        );
      
    },

    refreshToken : (req) => {
        return jwt.sign(
            {req} ,
                process.env.REFRESH_SECRET,
            {
                expiresIn: "10s", //토큰 확인을위해 10초 , 프로젝트 완료시 10m바꾸기
            }
        );
      
    },

    checkToken : (req, res ) => {
        try{
            if(req.headers.cookie){
                let cookies_token = cookie.parse(req.headers.cookie);
                cookies_token = cookies_token.refreshToken;
                console.log('Token checkToken 1', cookies_token)
                const decoded = jwt.verify(cookies_token, process.env.REFRESH_SECRET);
                console.log('decoded ',decoded)
                if(decoded){  
                    // console.log(decoded)
                    let refreshToken = jwt.sign(
                        {id :decoded.id},
                        process.env.REFRESH_SECRET,
                        {
                            expiresIn: "1m", //토큰 확인을 위해 1m, 프로젝트 완료시 1d로 바꾸기
                        }                  
                    );
                    
                    return refreshToken;
                }
            }
        }catch(err){
            console.log(err)
            return res.status(404).render('error');
        }     
    },
    
  };