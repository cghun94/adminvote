const express = require("express");
const router = express.Router();
const index_controller = require('../controllers/index');
const login_controller = require('../controllers/login');
const page_controller = require('../controllers/page');
const user_controller = require('../controllers/user')

//라우트 경로 / 유지보수
router.get('/', index_controller.index);

//로그인
router.get('/login', login_controller.getLogin);

router.post('/login', login_controller.postLogin);
router.post('/logout', login_controller.postLogout);

//page
router.get('/main', page_controller.getMain);
router.get('/signup', page_controller.getSignup);
router.get('/userlist', page_controller.getUserlist);

router.post('/userlist', page_controller.postUserlist);
//user
router.post('/signup_id', user_controller.postSignupid);
router.post('/signup_pw', user_controller.postSignuppw);
router.post('/signup', user_controller.postSignup);

module.exports = router;