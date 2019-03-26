var mongo = require("mongodb-curd");
var database = "lemonbill";

let userInfo = (req,res,next) => {
    mongo.find(database, "lemon_user", { account: req.body.account}, function (result) {
        var { account, password, name } = req.body;
        if (result.length === 0) {
            if (req.body.type) {
                mongo.insert(database,"lemon_user",{account:account,password:password,name:name},function (result) {
                    res.json({"code":2,"msg":"恭喜您注册成功"})
                    console.log(result.ops[0]["_id"])
                })
                return
            }
            res.json({ "code": 0, "msg": "账号不存在,请注册账号" }) 
        } else {
            if (req.body.type) {
                res.json({"code":0,"msg":"账号已存在"})
            } else {
                mongo.find(database, "lemon_user", {account:account,password:password}, function (result) {
                    if (result.length === 0) {
                        res.json({ "code": 1, "msg": "密码错误" })
                    } else {
                        res.json({ "code": 2, "msg":"登录成功","_id": result[0]["_id"]})
                    }
                })
            }
        }
    })
};

let billList = (req,res,next) => {
    mongo.find(database,"userInfo",function (result){
        console.log(result)
    })
}




module.exports = {
    userInfo,
    billList
 
}