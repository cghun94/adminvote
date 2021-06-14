const express = require("express");
const router = express.Router();
const index_controller = require('../controllers/index');
const login_controller = require('../controllers/login');
const page_controller = require('../controllers/page');
const userlist_controller = require('../controllers/userlist');
const signup_controller = require('../controllers/signup');
const trade_controller = require('../controllers/trade');
const log_controller = require('../controllers/log');

//라우트 경로 / 유지보수
router.get('/', index_controller.index);
router.get('/error', (req ,res) => {res.render('error')});

//로그인
router.get('/login', login_controller.getLogin);

router.post('/login', login_controller.postLogin);
router.post('/logout', login_controller.postLogout);

//page
router.get('/main', page_controller.getMain);

router.post('/header', page_controller.postHeader);

//userlist
router.get('/userlist', userlist_controller.getUserlist);
router.get('/userlist/userinfo', userlist_controller.getUserinfo);

router.post('/userlist', userlist_controller.postUserlist);
router.post('/userdelete', userlist_controller.postUserdelete);
router.post('/userlist/userAsset', userlist_controller.postUserAsset);

//trade page
router.get('/tradelist', trade_controller.getTradelist);
router.get('/tradelist/aip', trade_controller.getAIP);
router.get('/tradelist/kbh', trade_controller.getKBH);

router.post('/tradelist/buy', trade_controller.postBuy);

//sign up
router.get('/signup', signup_controller.getSignup);

router.post('/signup_id', signup_controller.postSignupid);
router.post('/signup_pw', signup_controller.postSignuppw);
router.post('/signup', signup_controller.postSignup);

//log page
router.get('/log', log_controller.getLog);

router.post('/log', log_controller.postLog);

module.exports = router;