require('dotenv').config({path : '/root/admin/.env'});
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

module.exports = {
    login: (req, res) => {
        return jwt.sign(
            {id: req},
                process.env.ACCESS_SECRET,
            {
                expiresIn: "1m",
            }
        );
      
    },

    checkToken : (req, res ) => {
        if(req.headers.cookie === undefined){
          return res.status(401).send('토큰없음')
        }
    
        if(req.headers.cookie){
            let cookies_token = cookie.parse(req.headers.cookie);
            cookies_token = cookies_token.accessToken;
            // console.log('checkToken cooki == ', cookies_token)
            const decoded = jwt.verify(cookies_token, process.env.SECRET_KEY);

            if(decoded){  
                // console.log(decoded)
                let refreshToken = jwt.sign(
                    {id :decoded.id},
                    process.env.REFRESH_SECRET,
                    {
                        expiresIn: "1m",
                    }                  
                );
                // let second = 1000; //쿠키 만료시간 초
                // console.log('재발급 = ',refreshToken);
                // res.cookie("accessToken", refreshToken ,{maxAge: 100 *second })
                return refreshToken;
            }
        }
        else{
            return res.json({
                success:  false,
                message : '토큰 검증 실패'
            });
        }     
    },
    logout : (req, res ) => {
        if(req.headers.cookie){
            let cookies_token = cookie.parse(req.headers.cookie);
            // console.log('checkToken cooki == ', cookies_token)
            cookies_token = cookies_token.accessToken;
            // console.log('checkToken cooki == ', cookies_token)
            const decoded = jwt.verify(cookies_token, process.env.SECRET_KEY);

            if(decoded){
                console.log('로그아웃2 토큰검증')
                res.clearCookie("accessToken").send(req.headers.accessToken);
            }
        }
        else{
            return res.json({
                success:  false,
                message : '토큰 검증 실패'
            });
        }
    }
  };