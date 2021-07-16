

module.exports = {
    reqbody : (req , res , next) => {        
        let body = req.body; 
        for(let prop in body){
            console.log(prop , body[prop] === '');
            let ck = body[prop] === '';
            if( ck === true ){
                console.log('true')
                .redirect('/');
            }            
        }
        return next();
    },
};