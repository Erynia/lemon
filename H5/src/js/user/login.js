require(["./js/config.js"],function (){
	require(["mui","axios"],function (mui){
		var account = document.querySelector("#account")
		var pasw = document.querySelector("#pasw")
		mui('.main').on('tap', '.login', function () {
			account.value = account.value.trim();
			pasw.value = pasw.value.trim();
			if (/\w[^_]{5,10}/.test(account.value)) {
				account.nextElementSibling.classList.add("active")
				if (/\w[^_]{5,10}/.test(pasw.value)) {
					pasw.nextElementSibling.classList.add("active")
					mui.ajax('/api/login', {
						data: {
							account: account.value,
							password: pasw.value
						},
						dataType: 'json',//服务器返回json格式数据
						type: 'post',//HTTP请求类型
						timeout: 10000,//超时时间设置为10秒；
						success: function (data) {
							if (data.code === 2) {
								account.value = null;
								window.localStorage.setItem("userId", data._id)
								window.location.href = "../../pages/user/billList.html"
							} else if (data.code === 1) {
								pasw.nextElementSibling.classList.remove("active")
								pasw.nextElementSibling.innerHTML = data.msg;
							} else {
								account.nextElementSibling.classList.remove("active");
								account.nextElementSibling.innerHTML = data.msg;
							}
						}
					});
				} else {
					pasw.nextElementSibling.classList.remove("active")
				}
			} else {
				account.nextElementSibling.classList.remove("active")
			}
		})

		mui('.main').on('tap', '.register', function () {
			window.location.href = "../../pages/user/register.html"
		})
	})
})
