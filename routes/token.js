require('dotenv').config({path : '/root/admin/.env'});
const jwt = require('jsonwebtoken');
const SECRET_KEY  = process.env.SECRET_KEY;

//nodejs 조헌영 책 
exports.isLoggedIn = (req, res , next) => {
    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn  = (req , res , next ) => {
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect('/');
    }
};

exports.verifyToken = (req , res , next) => {
    try{
        req.decoded = jwt.verify(req.headers.authorization , SECRET_KEY);
        //JWT 토큰은 req.headers.authorization에 들어 있음
        //req.decoded에 페이로드를 넣어 다음 미들웨어에서 쓸 수 있게 함
        return next();
    }
    catch(error){
        if(error.name === 'TokenExpiredError'){
            //유효기간초과
            return res.status(419).json({
                code : 419 ,
                message : '토큰이 만료되었습니다'
            });
        }//if end
        return res.status(401).json({
            code : 401,
            message : '유효하지 않은 토큰입니다'
            //토큰 위조 검사
        });

    }//catch end
};



