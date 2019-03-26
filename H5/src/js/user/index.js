define(["mui"],function (){

	mui.ajax('/api/bill_list',{
		data:{
			userId: window.localStorage.getItem("userId")
		},
		dataType:'json',//服务器返回json格式数据
		type:'post',//HTTP请求类型
		timeout:10000,//超时时间设置为10秒；
		success:function(data){
			console.log(data)
		}
	});
	
})
