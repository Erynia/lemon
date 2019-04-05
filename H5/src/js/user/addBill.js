require(["/js/config.js"],function () {
	require(["ajax", 'axios', "mui", "picker", "utils"], function (ajax, axios, mui) {
		let classify = document.querySelector(".header .H-tab li.active").getAttribute("data-classify");
		let menuWrap = document.querySelector(".menu-wrap");
		let year = window.location.search.match(/\=\d{4}/)[0].slice(1);
		let focus = document.querySelector(".focus");
		let timer = document.querySelector(".timer");
		let submit = document.querySelector(".submit");
		let total = document.querySelector(".header .H-total");
		let typeName = document.querySelector(".icon-describe")
		let curTime = (year + new Date().toLocaleDateString().slice(4)).formatTime("{0}-{1}-{2}");
		let picker = new mui.DtPicker({
			type: "date"
		});
		let titleY = document.querySelector("[data-id='title-y']").style.display = "none"
		let pickerY = document.querySelector("[data-id='picker-y']").style.display = "none"
		let titleM = document.querySelector("[data-id='title-m']").style.width = "50%";
		let packerM = document.querySelector("[data-id='picker-m']").style.width = "50%"
		let titleD = document.querySelector("[data-id='title-d']").style.width = "50%";
		let packerD = document.querySelector("[data-id='picker-d']").style.width = "50%";
		let icon = null;
		let remarks = null;
		let iconName = null;
		let iconParent = null;

		mui.init();

		let init = () => {
			timer.innerText = curTime.formatTime("{1}月{2}日")
			ajax("/api/bill_class", {
				Odata: {
					type: classify
				},
				Osuccess: function (result) {
					render(JSON.stringify(result.data))
				}
			})
			bindEvent()
		}

		let tabTap = function () {
			total.value = "0.00"
			let lis = this.parentNode.getElementsByTagName("li");
			for (let i = 0; i < lis.length; i++) {
				lis[i].classList.remove("active");
			}
			this.classList.add("active");
			total.flag = false;
			ajax('/api/bill_class', {
				Odata: {
					type: this.getAttribute("data-classify")
				},
				Osuccess: function (result) {
					render(JSON.stringify(result.data))
				}
			})
		}

		let iconTap = function () {
			iconParent = menuWrap.querySelectorAll("p");
			icon = this.getAttribute("data-icon");
			iconName = this.nextElementSibling.getAttribute("data-name")
			for (var i = 0; i < iconParent.length; i++) {
				iconParent[i].firstElementChild.classList.remove("active");
			}
			this.classList.add("active");
		}

		//=> 点击完成按钮的操作
		let submitTap = function () {
			classify = document.querySelector(".header .H-tab>li.active").getAttribute("data-classify");
			total = document.querySelector(".H-total")
			icon = document.querySelector(".icon.active").getAttribute("data-icon");
			typeName = document.querySelector(".icon.active").parentNode.getAttribute("data-name");
			remarks = document.querySelector(".remarks").value;
			var result = total.value.replace(/(\×|\÷)/g, function () {
				let curStr = arguments[1], operator;
				switch (curStr) {
					case "×":
						operator = "*"
						break;
					case "÷":
						operator = "/"
				}
				return operator
			})

			let obj = {
				"uid": window.localStorage.getItem("userId"),
				"timer": curTime,
				"bill": [
					{
						"type": classify,
						"name": typeName,
						"remarks": remarks || "无",
						"icon": icon,
						"money": eval(result).toFixed(2)
					}
				]
			}
			if (this.innerText === "=") {
				total.value = eval(result).toFixed(2);
				this.innerText = "完成"
			} else {
				axios.post("/api/add_bill", obj).then(res => console.log(res))
				window.location.href = "../../pages/user/billList.html"
				// ajax("/api/add_bill", {
				// 	Odata: obj,
				// 	Osuccess: function (result) {
				// 		console.log(result)
				// 	}
				// })
				// mui.post("/api/add_bill", {
				// 	data: obj
				// })
			}
		}

		//=> 操作显示时间的处理
		let handleTime = function () {
			picker.show((rs) => {
				var month = rs.m.text,
					date = rs.d.text,
					time = curTime = year + "-" + month + "-" + date;
				this.innerText = time.formatTime("{1}月{2}日")
			}, false);
		}

		//=> 操作数值框
		let calculatorTap = function () {
			if (!total.flag) {
				var val = this.innerText === "." ? "0." : (this.innerText === "0" ? "0." : this.innerText);
				total.value = "";
				total.value = this.classList.contains("delete") ? "0.00" : val;
				total.flag = true;
				return
			}

			if (/(\+|\-|\×|\÷)/g.test(total.value)) {
				submit.innerText = "="
			} else {
				submit.innerText = "完成"
			}

			//=> 如果当前输入框中 只有以一个0 的时候的处理
			if (total.value === "0") {
				if (this.innerText === "0") {
					total.value = "0.";
					return
				}
				if (this.classList.contains("delete") || /(\+|\-|\×|\÷)/g.test(this.innerText)) {
					total.value = total.value
					return
				}
				if (this.innerText === ".") {
					total.value = "0."
					return
				}
				if (this.innerText !== "0") {
					total.value = this.innerText;
					return
				}
			}

			//=> 如果点击的是删除按钮的处理
			if (this.classList.contains("delete")) {
				let ary = total.value.split("")
				ary.length >= 1 ? ary.length-- : null;
				total.value = ary.length === 0 ? 0 : ary.join("");
				return
			}

			//=> 当文本框中只有 "0." 的时候并且点击不是 "0" 的处理
			if (total.value === "0.") {
				if (/(\+|\-|\×|\÷|\.)/g.test(this.innerText)) {
					total.value = total.value
					return
				}

				if (this.innerText !== "0") {
					let val = this.innerText,
						flag = this.classList.contains("delete");
					total.value += flag ? total.value : val;
					return
				}
			}

			if (this.innerText === ".") {
				//=> 如果点击的是 "点" 做出的处理
				if (/^((\d+[.]\d+)[+-]\d+)$/g.test(total.value)) {
					total.value += this.innerText;
					return
				}
				//=> 如果在当前value 中有"." 了, 并且不是数学运算的时候的处理, 如果当前点的还是 "."做出的处理
				if (total.value.indexOf(".") > 0) {
					return
				}
			}

			//=> 如果输入框内容到最大长度了 的处理
			if (total.value.length > 12) {
				if (this.classList.contains("delete")) {
					let ary = total.value.split("")
					ary.length >= 1 ? ary.length-- : null;
					total.value = ary.join("")
				}
				total.value = total.value;
				return
			}

			//=> 如果当前输入框的第一个字符是 "0" 的时候并且当前点击的不是 "0" 的处理
			if (total.value[0] === "0" && this.innerText !== "0") {
				total.value += this.innerText;
				return
			}
			//=> 让当前文本框的内容拼接 我们单击的按钮
			total.value += this.innerText;
		}

		let bindEvent = () => {
			mui(".wrapper").on('tap', '.H-title', function (ev) {
				ev = ev || window.event;
				let evTarget = ev.target || ev.srcElement;

				if (evTarget.classList.contains("go-back")) {
					window.history.back(-1)
				}

				if (evTarget.classList.contains("tab-options")) {
					tabTap.call(evTarget)
				}


			})

			mui(".main").on('tap', '.M-menu', function (ev) {
				ev = ev || window.event;
				let evTarget = ev.target || ev.srcElement;
				if (evTarget.classList.contains("icon")) {
					iconTap.call(evTarget)
				}

				if (evTarget.classList.contains("submit")) {
					submitTap.call(evTarget)
				}

				if (evTarget.type === "text") {

				}

			})

			mui(".M-redact").on('tap', '.timer', function () {
				handleTime.call(this)
			})
			mui(".main").on('tap', '.calculator', function (ev) {
				ev = ev || window.event;
				evTarget = ev.target || ev.srcElement;
				if (evTarget.classList.contains("submit")) {
					submitTap.call(evTarget)
				}

				if (evTarget.classList.contains("number")) {
					calculatorTap.call(evTarget)
				}
			})
		}

		let render = function (result) {
			var frg = document.createDocumentFragment();
			var ary = result = JSON.parse(result);
			var len = Math.ceil(result.length / 8);


			focus.innerHTML = menuWrap.innerHTML = null;
			menuWrap.style.transform = "translate3d(0px, 0px, 0px) translateZ(0px)";
			let str = `<p class="custom">
						<span class="mui-icon mui-icon-plus icon"></span>
						<strong class="icon-describe">自定义</strong>
					</p>`

			for (var i = 0; i < len; i++) {
				var div = document.createElement("div");
				div.className = "mui-slider-item icon-container";
				frg.appendChild(div)
				focus.innerHTML += `<div class="mui-indicator ${i === 0 ? "mui-active" : ""}"></div>`
			}

			var html = ary.map((item, index) => {
				return `<p data-name="${item.name}">
					<span class="${index > 0 ? item.icon : item.icon + " active"} icon" data-icon="${item.icon}"></span>
					<strong class="icon-describe">${item.name}</strong>
				</p>`
			});

			Array.from(frg.children).forEach((item) => {
				if (item.children.length < 7) {
					item.innerHTML = html.splice(0, 8).join("");
				}
				let childnum = frg.children[frg.children.length - 1].children.length;
				if (childnum === 8) {
					var div = document.createElement("div");
					div.className = "mui-slider-item icon-container";
					frg.appendChild(div)
					focus.innerHTML += `<div class="mui-indicator"></div>`
					div.innerHTML = str;
				} else {
					frg.children[frg.children.length - 1].innerHTML += str
				}
			})
			menuWrap.appendChild(frg);
			frg = null;
			var gallery = mui('.mui-slider');
			gallery.slider();
		}

		init()
	})
})
