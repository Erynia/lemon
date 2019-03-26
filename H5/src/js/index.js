require.config({
	baseUrl: "../../js",
	paths:{
		mui: "libs/mui.min",
		list: "user/billList"
	}
})
require(["list"])
