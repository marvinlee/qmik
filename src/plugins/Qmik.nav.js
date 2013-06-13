/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @deprecated nav导航(利用hashchang事件实现前进后退民航,支持刷新后的前进后退)
 * @version:1.0
 */
(function(Q, define) {
	var win = Q.global, doc = win.document, loc = location, encode = Q.encode, //
	sun = Q.sun, isFun = Q.isFun, likeNull = Q.likeNull // 方法map
	config = {
		module : "module",// 处理方法标记名
		method : "method"
	//defaultModule : {module:"","method","",param:[]}// 默认的hashchange处理模块
	}, //
	isSupportHash = ("onhashchange" in win) && (doc.documentMode === undefined || doc.documentMode > 7);
	// 设置hash
	function set(hash) {
		loc.hash = hash;
	}
	// 取得hash
	function get() {
		return loc.hash.replace(/^#/g, "").trim()
	}
	// 取得模块参数信息,及模块名
	function getModuleParam(url) {
		var query = url || (likeNull(get()) ? loc.search.replace(/^\?/, "") : get()), //
		hs = query.split("&"), info = [];
		Q.each(hs, function(i, val) {
			var kv = val.split("=");
			info[Q.decode(kv[0])] = Q.decode(kv[1])
		});
		return info
	}
	function execModule(module, method, param) {
		var fun = Q.likeNull(method) ? module : module[method];
		return fun.apply(module, param)
	}
	// 加载使用模块
	function useModule(url) {
		var moduleName, method, param;
		if (isFun(url)) {
			url()
		} else if (Q.isObject(url)) {
			moduleName = url.module;
			method = url.method;
			param = url.param || [];
		} else {
			param = getModuleParam(url);
			moduleName = param[config.module];
			method = param[config.method];
		}
		moduleName && sun.use(moduleName, function(module) {
			// module(info)
			execModule(module, method, param)
		});
		return moduleName
	}
	function hashchange(_event) {
		// 当触发hashchange事件时,先使用hash,不行再使用url,再不行就使用默认的defaultModule
		useModule(loc.search.replace(/^\?/, ""))//
			|| (likeNull(config.defaultModule) || useModule(config.defaultModule))
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
			/**
			 * opts:{ url:"url字符串,选填,用户支持页面不支持hashchange时,跳转到url页面",
			 * param:[参数,选填,是个数组对象], callback:回调方法
			 * module:调用模块的模块名(alise:也是模块名,只是它是对模块名定义了一个别名) method:调用模块的方法名 }
			 */
			use : function(opts) {
				// {module:"",method:"",url:"",param:[],callback:fun}
				var url = opts.url, param = opts.param, callback = param.callback, method = opts.method;
				sun.use(opts.module, function(module) {
					if (Q.isString(url)) {
						if (isFun(param)) {
							callback = param;
							param = []
						}
					} else if (Q.isObject(url)) {
						param = url;
						url = null;
					} else if (isFun(url)) {
						callback = url;
						param = [];
						url = null
					}
					var hv = [];
					hv.push(encode(config.module) + "=" + encode(opts.module));
					hv.push(encode(config.method) + "=" + encode(method))
					Q.each(param, function(name, value) {
						hv.push(encode(name) + "=" + encode(value))
					});
					// 如果支持hashchange,或
					// viewUrl=="",只使用方式来显示新数据视图(如果isSupportHash为flase,在这种情况下,将不支持前进后退)
					if (isSupportHash || url == "") {
						unBind();
						set(hv.join("&"));
						var result = execModule(module, method, param);// module(param)
						callback && callback.apply(callback, [
							result
						]);
						setTimeout(bind, 500)
					} else {
						loc.href = url + (/\?/.test(url) ? "&" : "?") + hv.join("&");
					}
				})
			},
			onload : function(callback) {
				(likeNull(loc.hash) || likeNull(location.hash.replace(/^#/, ""))) && callback()
			},
			config : function(opt) {
				return Q.config(opt, config)
			}
		}
	});
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
