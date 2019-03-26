;(function (){
	let userName = document.querySelector("#userName");
	let userAccount = document.querySelector("#userAccount");
	let userPassword = document.querySelector("#userPassword");
	let clause = document.querySelector("#clause");
	let domAry = [userName,userAccount,userPassword]
	mui('.main').on('tap','.register-btn',function(){
		let flag = null;
		for (let i = 0; i < domAry.length; i++) {
			let val = domAry[i].value.trim();
			flag = val !== "" ? true : null;
		}
		if (flag) {
			if (/^(\w{5,15})$/.test(userAccount.value) && /(\w{5,15})/.test(userPassword.value)) {
				if (!clause.checked){
					mui.alert("请您阅读协议",'系统提示',"确定",function(e){
						return
					},'div')
					return
				} 
				mui.ajax('/api/register',{
					data:{
						type:"register",
						name: userName.value,
						account: userAccount.value,
						password: userPassword.value
					},
					dataType:'json',//服务器返回json格式数据
					type:'post',//HTTP请求类型
					timeout:10000,//超时时间设置为10秒；
					success:function(data){
						mui.alert(data.msg,'系统提示',data.code ? '现在去登录' : "确认" ,function (e) {
							if (data.code) {
								for (let i = 0; i < domAry.length; i++) {
									domAry[i].value = null;
								}
								window.location.href = "../../login.html"
							}  
						},'div')
					}
				});
			} else {
				console.log("您的账号或密码不符合规则")
			}
		} else{
			console.log("您的注册信息不能为空")
		}
	}) 
	

})();