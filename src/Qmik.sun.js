/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {
	var win = Q.global, loc = win.location, each = Q.each;
	var isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun;
	var config = {
		alias : {},
		paths : {},
		vars : {},
		map : [],
		preload : []
	};
	var cacheModule = {};
	base = loc.protocol + "//" + loc.pathname.replace(/\/[^\/]*$/, "/").replace(/\/\s*[0-9.]*\s*\/$/, "/")
	function sun() {
	}
	function Module(id, dependencies, factory) {
		var me = this;
		me.url = id2url(id);
		me.id = id;
		me.dependencies = dependencies;
		me.factory = factory;
		me.isReady = !1;//module is ready ,if no, request src from service
		me.exports = {}
	}
	Q.extend(sun, {
		use : use,
		// factory:function(require, exports, module)
		define : define,
		resolve : id2url,
		config : function(opts) {
			Q.extend(config, opts);
			return isString(opts) ? config[opts] : this
		}
	});
	// factory:function(require, exports, module)
	function define(id, dependencies, factory) {
		if (isFun(id)) {
			factory = id;
			dependencies = [];
			id = null;
		} else if (isFun(dependencies)) {
			var url = id2url(id);
			factory = dependencies;
			dependencies = []
		}
		dependencies = dependencies.concat(parseDepents(factory));
		cacheModule[url] = new Module(id, dependencies, factory)
	}
	//get depends from function.toString()
	function parseDepents(code) {
		code = code.toString();
		var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w ,]*\)/)[0].replace("\(", "")
			.replace("\)", "");
		var idx = params.indexOf(",");
		if (idx == -1) return [];
		var require = params.substring(0, idx);
		var pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
		var match = code.match(pattern);
		match = Q.map(match, function(i, v) {
			return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
		});
		match = Q.map(match, function(i, v) {
			return id2url(v)
		});
		return match
	}
	function use(ids, callback) {
		var params = [];
		if (isArray(ids)) {
			var idx = 0;
			each(ids, function(i, id) {
				preload(function() {
					load(ids, function(exports) {
						params.push(exports);
						if (++idx == ids.length) {
							callback && callback.apply(callback, params);
							delete idx, params
						}
					})
				})
			})
		} else {
			preload(function() {
				load(ids, function(exports) {
					params.push(exports);
					callback && callback.apply(callback, params);
					delete params
				})
			})
		}
	}
	function require(id) {
		return cacheModule[url]
	}
	Q.extend(require, {
		resolve : id2url,
		async : function(ids, callback) {
			use(ids, callback)
		}
	});
	function preload(callback) {
		var url, idx = 0, dependencies = config.preload, length = dependencies.length, depModule;
		if (length == 0) {
			callback()
		} else {
			each(dependencies, function(i, v) {
				url = id2url(v);
				request(url, function() {
					depModule = cacheModule[url];
					depModule.factory(require, depModule.exports, depModule);
					if (++idx == length) {
						delete idx, depModule;
						callback()
					}
				})
			})
		}
	}
	function load(id, callback, async) {
		var url = id2url(id), module = cacheModule[url];
		if (module) {
			if (module.isReady) {
				callback && callback(module.exports);
			} else {
				var idx = 0, depModule, dependencies = module.dependencies;
				each(dependencies, function(i, v) {
					request(v, function() {
						depModule = cacheModule[v];
						depModule.factory(require, depModule.exports, depModule);
						if (++idx == dependencies.length) {
							callback && callback(depModule.exports);
							delete idx, depModule
						}
					})
				})
			}
		} else {
			request(url, function() {
				module = cacheModule[url];
				module.factory(require, module.exports, module);
				callback && callback(module.exports)
			})
		}
	}
	function request(url, callback) {
		Q.log("request:" + url)
		if (/\/\s*[^\/]*.css[?]?/.test(url)) {
			var s = doc.createElement("link");
			s.type = "text/css";
			s.href = url;
			Q(doc.head).append(s);
			s.onload = callback;
		} else {
			Q.getScript(url, callback)
		}
	}
	function id2url(id) {
		id = alias2url(id);
		id = paths2url(id);
		id = vars2url(id);
		id = normalize(id);
		return map2url(id)
	}
	function normalize(url) {
		if (!/^[a-zA-Z0-9]+:\/\//.test(url)) {
			url = base + url
		}
		if (url.indexOf('?') === -1 && !/\.(css|js)$/.test(url)) {
			url += '.js';
		}
		return url
	}
	function alias2url(id) {
		return config.alias[id] || id;
	}
	function paths2url(id) {
		var key = id.match(/^[0-9a-zA-Z.]+/);
		key = key ? key[0] : id;
		return id.replace(new RegExp("^" + key), config.paths[key] || key)
	}
	function vars2url(id) {
		var key = id.match(/\{[0-9a-zA-Z.]+\}/);
		key = key ? key[0] : id;
		return id.replace(new RegExp(key), config.vars[key] || key)
	}
	function map2url(id) {
		each(config.map, function(i, v) {
			id.indexOf(v[0]) > -1 && id.replace(v[1])
		});
		return id
	}
	Q.sun = sun;
	win.define = sun.define;
	return sun
})(Qmik);
