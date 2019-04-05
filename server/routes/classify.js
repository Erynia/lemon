var mongo = require("mongodb-curd");
var database = "lemonbill";

//=> 查询用户信息
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

//=> 个人用户账单
let userBill = (req,res,next) => {
    var obj = {
        uid: req.body.userId,
        timer: new RegExp(req.body.timer)
    }
    mongo.find(database,"lemon_list",obj,function (result){
        if (result.length === 0) {
            res.json({"code":0,"msg":"您当前查询的时间没有记账","data":result})
            return 
        } 
        res.json({"code":1,"data":result})
    },{
        sort:{
            _id : -1
        }
    })
}

//=> 按支出/收入查找图标
let billClass = (req,res,next) => {
    let obj = {
        type: req.body.type
    }
    mongo.find(database,"lemon_icon",obj,(result) => {
        if(result.length === 0){
            res.json({"code":0,"msg":"获取失败","data":result})
            return
        }
        res.json({"code":1,"data":result})
    })
}

//=> 添加账单
let addBill = (req,res,next) => {
    mongo.insert(database,"lemon_list",req.body,(result) => {
        res.json({"code": 0,"msg":"添加成功"})
    })
}

//=> 删除账单
let deleteBill = (req,res,next) => {
    mongo.remove(database,"lemon_list",req.body,function (result) {
        res.json({"code":0,"msg":"删除成功"})
    })
} 



module.exports = {
    userInfo,
    userBill,
    billClass,
    addBill,
    deleteBill
}



// {
//     "uid": "5c9609dac4a2eb08a3b93b55",
//     "timer":"2019-02-13",
//     "bill" : [
//         {
//             "type":"income",
//             "icon": "mui-icon mui-icon-contact",
//             "money" : 1231.00,
//             "name":"餐饮"
//         },
//         {
//             "type": "expend",
//             "icon": "mui-icon mui-icon-contact",
//             "money": 888.00,
//             "name": "奖金"
//         }
//     ]
// }