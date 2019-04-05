var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var database = "lemonbill"
var classify = require("./classify.js")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//=> 登录接口
router.post('/login',classify.userInfo);

//=> 用户注册接口
router.post('/register',classify.userInfo);


module.exports = router;
