/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0 hash导航(利用hash的前进后退,支持刷新后的前进后退) hash规则: hash=encode(name + "=" +
 *              value)+"&"+encode(name + "=" + value); url:
 *              __hashSearch=encode(hash)#hash,
 */
(function($) {
	var doc = document, win = window, loc = location, moduleFlag = "module", //处理方法标记
	encode = $.encode; //方法map
	function set(hash) {
		loc.hash = hash;
	}
	function get() {
		return loc.hash.replace(/^#/g, "")
	}
	function getKey(h) {
		var key = h.match(/[^=]+=/);
		if (key) { return key[0].replace(/=$/g, "") }
	}
	function getVal(h, key) {
		return h ? h.replace(key, "").replace(/^=/g, "") : null
	}
	function getModuleInfo(url) {
		var query = url || get(), hs=query.split("&"), info = {};
		$.each(hs, function(i, val) {
			var kv = val.split("="), key = kv[0], value = kv[1];
			info[key] = value
		});
		return info
	}
	function hashchange(e, param) {
		var info = getModuleInfo(get() || loc.href), module = info[moduleFlag];
		$.sun.use(module,function(module){
			module(info)
		})
	}
	function bind() {
		$(win).on("hashchange", hashchange)
	}
	function unBind() {
		$(win).un("hashchange", hashchange, bind);
	}
	$(doc).ready(function() {
		bind();
		var ev = doc.createEvent ? doc.createEvent("MouseEvents") : null;
		hashchange(ev, null)
	})
	$.extend( {
		nav : {
			use : function(module, param, callback) {
				$.sun.use(module, function(module) {
					console.log("use module:" + module);
					var hv = [];
					hu.push(encode(moduleFlag) + "=" + encode(module))
					for ( var name in param) {
						hv.push(encode(name) + "=" + encode(param[name]))
					}
					unBind();
					set(hv.join("&"));
					module(param);
					callback && callback(param);
					setTimeout(bind, 500);
				});
			}
		}
	});
})(Qmik);