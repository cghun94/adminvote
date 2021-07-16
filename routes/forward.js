// const Parent = require('../module/parent');

let wheresql = null;
let param = null;

module.exports = {
    parent : (req, res , next) => {
        res.status(200)
        .render('forward/parent');                    
    },

    parentList : (req, res , next) => {
        //(wheresql ,param)
        wheresql = 'where salt = ?';
        param = [req.body.salt]
        // Parent.getList();
        // console.log(data);
    },
    
}