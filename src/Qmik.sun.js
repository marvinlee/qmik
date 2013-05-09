/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {
	var win = Q.global, loc = win.location, each = Q.each;
	var isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun, isNull = Q.isNull;
	var config = {
		alias : {},
		paths : {},
		vars : {},
		map : [],
		preload : []
	};
	var cacheModule = {};
	var base = loc.protocol + "//" + loc.pathname.replace(/\/[^\/]*$/, "/").replace(/\/\s*[0-9.]*\s*\/$/, "/");
	var sun = {};
	function Module(id, dependencies, factory) {
		Q.extend(this, {
			url : id2url(id),
			id : id || id2url(id),
			dependencies : dependencies,
			factory : factory,
			//module is ready ,if no, request src from service
			isReady : !1,
			exports : {},
			destroy : function() {
				delete cacheModule[id]
			}
		})
	}
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
		Q.log("define:" + Q.unique(dependencies))
		cacheModule[id] = new Module(id, Q.unique(dependencies), factory)
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
	//require module
	function require(id) {
		var module = cacheModule[id];
		return module ? module.exports : module
	}
	Q.extend(require, {
		resolve : id2url,
		async : function(ids, callback) {
			use(ids, callback)
		}
	});
	//pre load module
	function preload(callback) {
		var url, idx = 0, dependencies = config.preload, length = dependencies.length, depModule;
		if (length == 0) {
			callback()
		} else {
			each(dependencies, function(i, id) {
				url = id2url(id);
				request(url, function() {
					depModule = cacheModule[id];
					depModule.factory(require, depModule.exports, depModule);
					if (++idx == length) {
						callback()
						delete idx, depModule, dependencies;
					}
				})
			})
		}
	}
	function load(id, callback) {
		var module = cacheModule[id];
		if (module) {
			if (module.isReady) {
				callback && callback(module.exports);
			} else {
				var idx = 0, depModule, dependencies = module.dependencies;
				console.log("dependencies:" + dependencies)
				each(dependencies, function(i, _id) {
					request(id2url(_id), function() {
						depModule = cacheModule[_id];
						depModule.factory(require, depModule.exports, depModule);
						if (++idx == dependencies.length) {
							module.factory(require, module.exports, module);
							module.isReady = !0;
							callback && callback(module.exports);
							delete idx, depModule
						}
					})
				})
			}
		} else {
			request(id2url(id), function() {
				module = cacheModule[id];
				module.factory(require, module.exports, module);
				callback && callback(module.exports)
			})
		}
	}
	function request(url, callback) {
		var nurl, idx = url.indexOf("?");
		nurl = idx >= 0 ? url.substring(0, url.indexOf("?")).trim() : url;
		console.log("request url:" + url)
		if (/\/.+\.css$/i.test(nurl)) {
			var s = doc.createElement("link");
			s.type = "text/css";
			s.rel = 'stylesheet';
			s.href = url;
			Q(win.document.head).append(s);
		} else {
			Q.getScript(url, function() {
				callback();
				win.define = sun.define
			})
		}
	}
	////////////////// id to url start ///////////////////////////////
	function id2url(id) {
		isNull(id) && (id = loc.href);
		id = alias2url(id);
		id = paths2url(id);
		id = vars2url(url);
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
	//////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use : use,
		// factory:function(require, exports, module)
		define : define,
		resolve : id2url,
		config : function(opts) {
			Q.isObject(opts) && Q.extend(config, opts);
			return isString(opts) ? config[opts] : null
		}
	});
	Q.sun = sun;
	win.define = sun.define;
})(Qmik);
