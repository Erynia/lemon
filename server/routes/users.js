var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var database = "lemonbill";
var classify = require("./classIfy.js")

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//=> 查询用户账单
router.post("/bill_list",classify.userBill)

//=> 按账单类别查询
router.post("/bill_class",classify.billClass)

//=> 用户添加账单
router.post("/add_bill",classify.addBill)

//=> 删除用户账单
router.post("/delete_bill",classify.deleteBill)
module.exports = router;
