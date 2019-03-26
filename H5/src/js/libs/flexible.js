(function (d, f) {
    var s = d.document,
        c = s.documentElement,
        m = s.querySelector('meta[name="viewport"]'),
        n = s.querySelector('meta[name="flexible"]'),
        a = 0,
        r = 0,
        b = 0,
        l,
        e = f.flexible || (f.flexible = {});
    if (n) {
        var j = n.getAttribute("content");
        if (j) {
            var q = j.match(/initial\-dpr=([\d\.]+)/);
            var h = j.match(/maximum\-dpr=([\d\.]+)/);
            if (q) {
                a = parseFloat(q[1]);
                r = parseFloat((1 / a).toFixed(2))
            } if (h) {
                a = parseFloat(h[1]);
                r = parseFloat((1 / a).toFixed(2))
            }
        }
    }
    if (!a && !r) {
        var p = d.navigator.appVersion.match(/android/gi),
            o = d.navigator.appVersion.match(/iphone/gi),
            k = d.devicePixelRatio;
        if (k >= 3 && (!a || a >= 3)) {
            a = 3
        } else {
            if (k >= 2 && (!a || a >= 2)) {
                a = 2
            } else {
                a = 1
            }
        }
        r = 1 / a
    }
    c.setAttribute("data-dpr", a);
    m = s.createElement("meta");
    m.setAttribute("name", "viewport");
    m.setAttribute("content", "width=device-width, initial-scale=" + r + ", maximum-scale=" + r + ", minimum-scale=" + r + ", user-scalable=no");
    if (c.firstElementChild) {
        c.firstElementChild.appendChild(m)
    } else {
        var g = s.createElement("div");
        g.appendChild(m);
        s.write(g.innerHTML)
    }

    function i() {
        var u = c.getBoundingClientRect().width;
        if (u / a > 540) {
            u = 540 * a
        }
        var w = u / 10;
        c.style.fontSize = w + "px";
        e.rem = d.rem = w;
        var v = parseFloat(c.style.fontSize),
            t = parseFloat(window.getComputedStyle(c).getPropertyValue("font-size"));
        console.log("flexible.refreshRem: fontSize && finalFontSize => ", v, t);
        if (v !== t) {
            c.style.fontSize = v * (v / t) + "px";
            console.log("flexible.refreshRem.fixed: fontSize  => ", c.style.fontSize)
        }
    };
    d.addEventListener("resize", function () {
        clearTimeout(l);
        l = setTimeout(i, 300)
    }, false);
    d.addEventListener("pageshow", function (t) {
        if (t.persisted) {
            clearTimeout(l);
            l = setTimeout(i, 300)
        }
    }, false);
    if (s.readyState === "complete") {
        s.body.style.fontSize = 12 * a + "px"
    } else {
        s.addEventListener("DOMContentLoaded", function (t) {
            s.body.style.fontSize = 12 * a + "px"
        }, false)
    }
    i();
    e.dpr = d.dpr = a;
    e.refreshRem = i;
    e.rem2px = function (u) {
        var t = parseFloat(u) * this.rem; if (typeof u === "string" && u.match(/rem$/)) {
            t += "px"
        }
        return t
    };
    e.px2rem = function (u) {
        var t = parseFloat(u) / this.rem; if (typeof u === "string" && u.match(/px$/)) {
            t += "rem"
        }
        return t
    }
})(window, window["lib"] || (window["lib"] = {}));

