/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0
 * hash导航(利用hash的前进后退,支持刷新后的前进后退)
 * hash规则:  hash=encode(name + "=" + value)+"&"+encode(name + "=" + value);
 *    url:   __hashSearch=encode(hash)#hash,
 */
(function ($) {
    var doc = document,
        win = window,
        loc = location,
        _flag = "__flag",//处理方法标记
        _flagParam = "__hashSearch",//把hash值放到地址栏参数的名字
        nav = {
            set: function (hash) {
                /*var hs = loc.hash,
                    href = loc.href,
                    tmp,
                    param = "&" + _flagParam + "=" + $.encode(hash);
                href = href.replace(hs, "").replace(new RegExp(param, "g"), "");
                tmp = href.match(regFlagParam);
                if (tmp) {
                    href = href.replace("&" + tmp[0], "")
                }
                loc.href = href.replace(/&{2,}/g, "&") + param + "#" + hash
                */
                loc.hash = hash;
            },
            get: function () { return loc.hash.replace(/^#/g, "") }
        },
        map = {},//方法map
        regA = /[^=]+=[^&]+[&]?/g,
        regKey = /[^=]+=/g,
        regFlagParam = new RegExp(_flagParam + "\s*=([^&]|[^#])+")
    ;
    function getKey(h) {
        if (h) {
            var key = h.match(regKey);
            if (key) {
                return key[0].replace(/=\s*$/g, "")
            }
        }
    }
    function getVal(h, key) {
        return h?h.replace(key, "").replace(/^=/g, ""):null
    }
    function getFlagParam() {//取规则的参数
        href = loc.href.match(regFlagParam);
        if (href) return href[0]
    }
    function hashchange(e,param) {
        var query = nav.get() || param,
            hs,
            h,
            key,
            val,
            obj = {}
        ;
        hs = query.split("&");
        for (var i in hs) {
            h = $.decode(hs[i]);
            h = h.replace(/&$/g, "");
            key = getKey(h);
            if (key) {
                val = getVal(h, key);
                obj[key] = val
            }
        }
        console.log("hashchange result:>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log(obj);
        if (obj && obj[_flag]) {
            var fun = map[obj[_flag]];
            fun && fun.apply(fun)
        }
    }

    function bind() { $(win).on("hashchange", hashchange) }
    $(doc).ready(function () {
        bind();
        var href = getFlagParam(loc.href),
            ev = doc.createEvent ? doc.createEvent("MouseEvents") : null;
        if (nav.get()) {
            href = nav.get() ? nav.get() : $.decode(href);
            hashchange(ev,href)
        } else if (href) {
            href = getFlagParam(href);
            var key = getKey(href),
                val = getVal(href, key);
            hashchange(ev, $.decode(val))
        }
    })

    $.extend({
        Hash: {
            hash: function (flag, param, callback) {
                var hv = [];
                hv.push($.encode(_flag + "=" + flag));
                for (var name in param) {
                    hv.push($.encode(name + "=" + param[name]))
                }
                //$(win).un("hashchange", hashchange, bind);
                nav.set(hv.join("&"));
                //setTimeout(bind, 500);
            },
            register: function (flag, fun) {
                map[flag] = fun
            }
        }
    });
})(Qmik);