const router = require('express').Router();
const auth = require('../module/auth');
const main = require('./main');
const forward = require('./forward');
const Conn = require('./../config/database').api();

const test = async() => {
    console.log('test 1')
    let data = await Conn.query('select * from parent order by salt desc limit 10')
    data0 = data[0]
    console.log(data0);
}
test();
/* GET home page. */
router.get('/',main.index);

router.get('/login',  main.login);

router.get('/sign', main.sign);

router.post('/login/post',  auth.reqbodyCheck,   main.loginPost); 

router.get('/parent', forward.parent);

router.post('/parent/list', auth.reqbodyCheck, forward.parentList);

module.exports = router;
