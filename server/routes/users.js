var express = require('express');
var router = express.Router();
var mongo = require("mongodb-curd");
var database = "lemonbill";

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/bill_list",function (req,res,next){
  mongo.find(database,"lemon_list",{uid:req.body.userId},function (result) {
    console.log(result)
    res.render({"code":1})
  })
})


module.exports = router;
