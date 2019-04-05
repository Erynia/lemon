require(["/js/config.js"],function () {
	require(["mui", "axios", "flexible", "picker"], function (mui, axios) {
		class billDetail {
			constructor() {
				this.bill = document.querySelector("#bill");
				this.timer = document.querySelector("#timer");
				this.timerMonth = document.querySelector("#timerMonth");
				this.total = document.querySelector(".total");
				this.incomeTotal = document.querySelector(".incomeTotal");
				this.curSurplus = document.querySelector(".curSurplus")
				this.curType = "month";
				this.curText = this.timer.innerText;
				this.curTime = document.querySelectorAll(".curTime")
				this.titleY = null;
				this.titleM = null;
				this.pickerY = null;
				this.pickerM = null;
				this.init()
			}

			ajax(api, opts) {
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

			formatTime(type) {
				var curTimer = new Date(),
					result = null,
					month = curTimer.getMonth() + 1;
				switch (type) {
					case "year":
						result = curTimer.getFullYear();
						break;
					case "month":
						result = curTimer.getFullYear() + "-" + (month < 10 ? "0" + month : month);
						break;
					default:
						result = curTimer.toLocaleDateString()
				}
				return result
			}

			init() {
				this.timer.innerText = this.formatTime("month")
				this.ajax('/api/bill_list', {
					Odata: {
						userId: window.localStorage.getItem("userId"),
						timer: this.timer.innerText
					},
					Osuccess: result => {
						console.log("页面一进来的数据--->", result)
						this.render(result.data)
					}
				})
				mui.init()
				this.picker = new mui.DtPicker({
					type: "month"
				});
				this.popPicker = new mui.PopPicker();
				this.bindEvent()
			}



			render(data) {
				var total = 0,
					incomeTotal = 0,
					frg = document.createDocumentFragment(),
					color = ["red expend", "green income"];
				data.forEach((item) => {
					for (let key in item) {
						if (item[key] instanceof Array) {
							for (var i = 0; i < item[key].length; i++) {
								var curItem = item[key][i];
								var li = document.createElement("li");
								li.className = "mui-table-view-cell"
								li.innerHTML = `<div class="mui-slider-right mui-disabled">
												<a class="mui-btn mui-btn-red" data-id="${item._id}">删除</a>
											</div>
											<div class="mui-slider-handle" >
												<p>
													<strong>
														<span class="${curItem.icon}"></span>
														<em>${curItem.remarks === "无" ? curItem.name : curItem.remarks}</em>
													</strong>
													<b class="${curItem.type === "expend" ? color[0] : color[1]}">${curItem.money}</b>
												</p>
											</div>`
								frg.appendChild(li);
							}
						}
					}
				})
				this.bill.innerHTML = null;
				this.bill.appendChild(frg);
				frg = null;
				let expends = document.querySelectorAll(".expend");
				let incomes = document.querySelectorAll(".income");
				[].slice.call(expends).forEach((item, index) => {
					total += Number(item.innerText);
					incomeTotal += Number(incomes[index] ? incomes[index].innerText : null)
				});
				this.curSurplus.innerText = (incomeTotal - total).toFixed(2);
				this.total.innerHTML = total.toFixed(2);
				this.incomeTotal.innerText = incomeTotal.toFixed(2);
			}

			bindEvent() {
				var _this = this;
				mui('.header').on('tap', '#timer', function () {
					_this.titleY = document.querySelector("[data-id='title-y']")
					_this.pickerY = document.querySelector("[data-id='picker-y']")
					_this.titleM = document.querySelector("[data-id='title-m']")
					_this.pickerM = document.querySelector("[data-id='picker-m']")
					var prevTimer = this.innerText;
					//=> 判断全局下的当前是按什么显示的数据的方式
					if (_this.curType === "year") {
						_this.titleM.style.display = "none";
						_this.pickerM.style.display = "none";
						_this.titleY.style.width = "100%";
						_this.pickerY.style.width = "100%";
					} else {
						_this.titleM.style.display = "";
						_this.pickerM.style.display = "";
						_this.titleY.style.width = "50%";
						_this.pickerY.style.width = "50%";
					}

					_this.picker.show((rs) => {
						if (_this.curType === "year") {
							this.innerText = rs.text.substr(0, 4);
						} else {
							_this.curText = this.innerText = rs.text;
						}

						_this.ajax('/api/bill_list', {
							Odata: {
								userId: window.localStorage.getItem("userId"),
								timer: this.innerHTML
							},
							Osuccess: result => {
								// console.log("改变年月之后,后台返回的结果====>",result)
								if (result.data.length === 0) {
									mui.alert(result.msg, "友情提示", '确定', () => {
										this.innerText = prevTimer
									})
									return
								}
								_this.render(result.data)
							}
						});
					}, false);
				})

				mui('.header').on('tap', '#timerMonth', function () {
					_this.popPicker.setData([
						{ value: 'year', text: '年' },
						{ value: "month", text: "月" }
					]);
					_this.popPicker.show((result) => {
						_this.curType = result[0].value;
						_this.titleY = document.querySelector("[data-id='title-y']")
						if (result[0].value === "year") {
							_this.timer.innerHTML = _this.timer.innerHTML.substr(0, 4);
							_this.curType = "year"
						} else {
							_this.timer.innerHTML = _this.curText;
							_this.curType = "month"
						}
						this.innerText = result[0].text;
						//=> 改变当前显示的年月
						for (var i = 0; i < _this.curTime.length; i++) {
							_this.curTime[i].innerText = this.innerText
						}
						_this.ajax('/api/bill_list', {
							Odata: {
								userId: window.localStorage.getItem("userId"),
								timer: _this.timer.innerHTML
							},
							Osuccess: result => {
								console.log("改变年月之后,后台返回的结果====>", result)
								_this.render(result.data)
							}
						});
					})
				})

				mui('.main-tab').on('tap', 'em', function () {
					if (this.innerText === "图表") {
						this.classList.add("active");
						this.previousElementSibling.classList.remove("active")
						_this.bill.innerHTML = "图表页"
					} else {
						this.classList.add("active");
						this.nextElementSibling.classList.remove("active");
						_this.ajax('/api/bill_list', {
							Odata: {
								userId: window.localStorage.getItem("userId"),
								timer: _this.timer.innerText
							},
							Osuccess: result => {
								console.log("页面一进来的数据--->", result)
								_this.render(result.data)
							}
						})
					}
				})

				mui('.bill').on('tap', '.mui-btn', function (event) {
					var btnArray = ['确认', '取消'];
					var elem = this;
					var li = elem.parentNode.parentNode;
					mui.confirm('确认删除该条记录？', 'Hello MUI', btnArray, (e) => {
						if (e.index == 0) {
							li.parentNode.removeChild(li);
							axios({
								url: "/api/delete_bill",
								method: "post",
								data: {
									_id: this.getAttribute("data-id")
								}
							}).then(result => {
								console.log(result.data.msg)
							})
						} else {
							setTimeout(function () {
								mui.swipeoutClose(li);
							}, 0);
						}
					});
				});
				mui('.footer').on('tap', '.add-bill', function () {
					var year = _this.timer.innerText.substring(0, 4);
					window.location.href = "../../pages/user/addbill.html?year=" + year;
				})
			}
		}

		new billDetail()
	})
})





