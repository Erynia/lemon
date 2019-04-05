
;(function (pro) {
    pro.formatTime = function (template = "{0}年{1}月{2}日 {3}时{4}分{5}秒") {
        let ary = [...this.match(/(\d+)/g)].map((item) => { 
            item = Number(item)
            return item < 10 ? "0" + item : item
        })
        template = template.replace(/\{(\d+)\}/g,function (...[,index]) {
            return ary[index] ? ary[index] : "00"
        })
        return template
    }
})(String.prototype);


