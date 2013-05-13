/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0 hash导航(利用hash的前进后退,支持刷新后的前进后退) hash规则: hash=encode(name + "=" +
 *              value)+"&"+encode(name + "=" + value); url:
 *              __hashSearch=encode(hash)#hash,
 */
(function($) {
	var doc = document, win = window, loc = location, moduleFlag = "module", //处理方法标记
	encode = $.encode, sun = $.sun; //方法map
	function set(hash) {
		loc.hash = hash;
	}
	function get() {
		return loc.hash.replace(/^#/g, "").trim()
	}
	function getKey(h) {
		var key = h.match(/[^=]+=/);
		if (key) { return key[0].replace(/=$/g, "") }
	}
	function getVal(h, key) {
		return h ? h.replace(key, "").replace(/^=/g, "") : null
	}
	function getModuleInfo(url) {
		var query = url || (get() == "" ? loc.search.replace(/^\?/, "") : get()), //
		hs = query.split("&"), info = {};
		$.each(hs, function(i, val) {
			var kv = val.split("="), key = kv[0], value = kv[1];
			info[key] = value
		});
		return info
	}
	function useModule(_event, url) {
		var info = getModuleInfo(url), moduleName = info[moduleFlag];
		moduleName && sun.use(moduleName, function(module) {
			module(info)
		});
		return moduleName
	}
	function hashchange(_event) {
		useModule(_event) || useModule(_event, loc.search.replace(/^\?/, ""))
	}
	function bind() {
		$(win).on("hashchange", hashchange)
	}
	function unBind() {
		$(win).un("hashchange", hashchange, bind);
	}
	$(doc).ready(function() {
		bind();
		hashchange(doc.createEvent ? doc.createEvent("MouseEvents") : null)
	})
	$.extend( {
		nav : {
			use : function(moduleName, info, callback) {
				sun.use(moduleName, function(module) {
					var hv = [];
					hv.push(encode(moduleFlag) + "=" + encode(moduleName))
					$.each(info, function(name, value) {
						hv.push(encode(name) + "=" + encode(value))
					})
					unBind();
					set(hv.join("&"));
					module(info);
					callback && callback(param);
					setTimeout(bind, 500);
				});
			}
		}
	});
})(Qmik);