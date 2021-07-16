require('dotenv').config();
const admin = require('../module/admin');
const bcrypt = require('bcrypt');
const auth = require('../module/auth');

/**
 * 규칙
 * get 은 생략 , metod type을 뒤에 붙이기 
 */

//데이터 확인 및 패스워드 확인 함수
//pwCheck(DB데이터 ROw , req ,res)
const pwCheck =  async (data ,req,res) => {
    if( data === undefined || data.length === 0){
        console.log('존재하지 않는 이메일이거나 비밀번호가 틀렸습니다')
        return res.status(403)
        .json({
            code : 403,
            message : '존재하지 않는 이메일이거나 비밀번호가 틀렸습니다'
        })
    }
    let pwCk = await bcrypt.compare(req.body.password , data.password)
    console.log(pwCk)
    if(pwCk === true){
        //DB 이메일 및 비밀번호 일치 
        //토큰 생성
        await auth.accessToken(req ,res , data.email);
    }
    else{
        console.log('비밀번호가 틀렸습니다')
        return res.status(403)
        .json({
            code : 403,
            message : '비밀번호가 틀렸습니다'
        });
    }
    
};

module.exports = {
    index : (req, res , next) => {
        res.status(200)
        .render('main');                    
    },

    login : (req, res , next) => {
        res.status(200)
        .render('auth/login');                    
    },

    loginPost : async (req, res , next) => {
        let wheresql =null;
        let param= null;        
        wheresql = 'where email = ?';
        param = [req.body.email];
        let data = await admin.getRow(wheresql , param);
        //데이터 확인 및 패스워드 확인
        pwCheck(data, req,res);
        
    },

    sign : (req, res , next) => {
        res.status(200)
        .render('sign');                    
    },
}