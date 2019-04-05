define(["mui"],function () {
    function ajax(api, opts) {
        let {
            Otype = "post",
            Odata = {},
            OdataType = "json",
            Osuccess
        } = opts
        mui.ajax(api, {
            data: Odata,
            dataType: OdataType,//服务器返回json格式数据
            type: Otype,//HTTP请求类型
            timeout: 10000,//超时时间设置为10秒；
            success: Osuccess
        });

        // mui.ajax('/api/bill_list', {
        // 	data: {
        // 		userId: window.localStorage.getItem("userId")
        // 	},
        // 	dataType: 'json',//服务器返回json格式数据
        // 	type: 'post',//HTTP请求类型
        // 	timeout: 10000,//超时时间设置为10秒；
        // 	success: result => {
        // 		console.log(result)
        // 		this.render(result.data)
        // 	}
        // });
    }
    return ajax
})
