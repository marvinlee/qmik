/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @deprecated nav导航(利用hashchang事件实现前进后退民航,支持刷新后的前进后退)
 * @version:1.0
 */
(function(Q) {
	var win = Q.global, doc = win.document, loc = location, encode = Q.encode, sun = Q.sun, isFun = Q.isFun, // 方法map
	config = {
		module : "module"// 处理方法标记名
	}, //
	isSupportHash = ("onhashchange" in win) && (doc.documentMode === undefined || doc.documentMode > 7);
	;
	function set(hash) {
		loc.hash = hash;
	}
	function get() {
		return loc.hash.replace(/^#/g, "").trim()
	}
	function getModuleInfo(url) {
		var query = url || (get() == "" ? loc.search.replace(/^\?/, "") : get()), //
		hs = query.split("&"), info = {};
		Q.each(hs, function(i, val) {
			var kv = val.split("=");
			info[kv[0]] = kv[1]
		});
		return info
	}
	function useModule(_event, url) {
		var info = getModuleInfo(url), moduleName = info[config.module];
		moduleName && sun.use(moduleName, function(module) {
			module(info)
		});
		return moduleName
	}
	function hashchange(_event) {
		useModule(_event) || useModule(_event, loc.search.replace(/^\?/, ""))
	}
	function bind() {
		Q(win).on("hashchange", hashchange)
	}
	function unBind() {
		Q(win).un("hashchange", hashchange, bind);
	}
	Q(doc).ready(function() {
		bind();
		hashchange(doc.createEvent ? doc.createEvent("MouseEvents") : null)
	})
	Q.extend( {
		nav : {
			use : function(moduleName, viewUrl, info, callback) {
				sun.use(moduleName, function(module) {
					if (Q.isString(viewUrl)) {
						if (isFun(info)) {
							callback = info;
							info = {}
						}
					} else if (Q.isObject(viewUrl)) {
						info = viewUrl;
						viewUrl = null;
					} else if (isFun(viewUrl)) {
						callback = viewUrl;
						info = {};
						viewUrl = null
					}
					var hv = [];
					hv.push(encode(config.module) + "=" + encode(moduleName))
					Q.each(info, function(name, value) {
						hv.push(encode(name) + "=" + encode(value))
					});
					if (isSupportHash || viewUrl == "") {
						unBind();
						set(hv.join("&"));
						callback && callback(module(info), info);
						setTimeout(bind, 500)
					} else {
						loc.href = viewUrl + (/\?/.test(viewUrl) ? "&" : "?") + hv.join("&");
					}
				})
			},
			config : function(opt) {
				return Q.config(opt, config)
			}
		}
	})
})(Qmik);
