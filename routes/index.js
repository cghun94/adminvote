const express = require("express");
const router = express.Router();
const index_controller = require('../controllers/index');
const login_controller = require('../controllers/login');
const page_controller = require('../controllers/page');
const usersign_controller = require('../controllers/usersign')

//라우트 경로 / 유지보수
router.get('/', index_controller.index);
router.get('/error', (req ,res) => {res.render('error')});

//로그인
router.get('/login', login_controller.getLogin);

router.post('/login', login_controller.postLogin);
router.post('/logout', login_controller.postLogout);

//page
router.get('/main', page_controller.getMain);
router.get('/signup', page_controller.getSignup);
router.get('/userlist', page_controller.getUserlist);
router.get('/userlist/userinfo', page_controller.getUserinfo);

router.post('/userlist', page_controller.postUserlist);
router.post('/userdelete', page_controller.postUserdelete);
router.post('/userlist/userinfo', page_controller.postUserinfo);
router.post('/userlist/userinfo/aip', page_controller.postUserinfoAIP);

//usersign
router.post('/signup_id', usersign_controller.postSignupid);
router.post('/signup_pw', usersign_controller.postSignuppw);
router.post('/signup', usersign_controller.postSignup);

module.exports = router;