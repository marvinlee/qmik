/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {
	var win = Q.global, doc = win.document, loc = win.location, hostname = loc.hostname, each = Q.each;
	var isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun, isNull = Q.isNull;
	var config = {
		alias : {},
		paths : {},
		vars : {},
		map : [],
		preload : [],
		base : loc.protocol + "//" + hostname
	//
	// context://工程目录
	};
	var cacheModule = {}, currentScript;
	var sun = {};
	function Module(id, dependencies, factory) {
		var me = this;
		Q.extend(me, {
			url : id2url(id),
			id : id || id2url(id),
			dependencies : dependencies,// 依赖模块
			factory : factory,
			// module is ready ,if no, request src from service
			isReady : !1,// is ready ,default false,
			exports : {},// export object
			createTime : Q.now(),// create time
			lastTime : Q.now(),
			useCount : 0,// use count,使用次数
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
			id = getCurrentScript().src;
		} else if (isFun(dependencies)) {
			factory = dependencies;
			dependencies = []
		}
		if (!getModule(id) || !Q.isIE()) {
			dependencies = dependencies.concat(parseDepents(factory));
			cacheModule[id] = new Module(id, Q.unique(dependencies), factory)
		}
	}
	// get depends from function.toString()
	function parseDepents(code) {
		code = code.toString();
		var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w ,]*\)/)[0].replace("\(", "").replace("\)", "");
		var match = [], idx = params.indexOf(",");
		if (idx >= 0) {
			var require = params.substring(0, idx), pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
			match = Q.map(code.match(pattern), function(i, v) {
				return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
			})
		}
		return match
	}
	function use(ids, callback) {
		preload(function() {
			if (isArray(ids) && ids.length > 0) {
				var params = [];
				(function bload(idx) {
					load(ids[idx], function(exports) {
						params.push(exports);
						idx == ids.length - 1 ? callback && callback.apply(callback, params) : bload(idx + 1)
					})
				})(0);
			} else {
				load(ids, function(exports) {
					callback && callback.apply(callback, [
						exports
					]);
				})
			}
		})
	}
	// require module
	function require(id) {
		return getModule(id) ? getModule(id).exports : null
	}
	Q.extend(require, {
		resolve : id2url
	});
	function getModule(id) {
		return cacheModule[id] || cacheModule[id2url(id)]
	}
	// pre load module
	function preload(callback) {
		var dependencies = config.preload, length = dependencies.length, params = [];
		length == 0 ? callback() : (function bload(idx) {
			load(dependencies[idx], function(exports) {
				params.push(exports);
				idx == length - 1 ? callback && callback.apply(callback, params) : bload(idx + 1)
			})
		})(0);
	}
	function load(id, callback) {
		var module = getModule(id);
		if (module) {
			if (module.isReady) {
				useModule(module, require, callback)
			} else {
				var idx = 0, depModule, dependencies = module.dependencies;
				if (dependencies.length < 1) {
					useModule(module, require, callback)
				} else {
					each(dependencies, function(i, _id) {
						request(_id, function() {
							useModule(getModule(_id), require, callback);
							++idx == dependencies.length && useModule(module, require, callback)
						})
					})
				}
			}
		} else {
			request(id, function() {
				useModule(getModule(id), require, callback)
			})
		}
	}
	function useModule(module, require, callback) {
		if (module.isReady != !0) {
			var nm = module.factory(require, module.exports, module);
			module.exports = module.exports || nm
		}
		module.isReady = !0;
		module.useCount++;
		module.lastTime = Q.now();
		callback && callback(module.exports)
	}
	function request(id, callback) {
		var url = id2url(id), idx = url.indexOf("?");
		if (/\/.+\.css\s*$/i.test(idx >= 0 ? url.substring(0, idx) : url)) {
			var node = doc.createElement("link");
			// node.type = "text/css";
			node.rel = 'stylesheet';
			node.href = url;
			Q(win.document.head).append(node)
		} else {
			currentScript = Q.getScript(url, function() {
				var module = getModule(id);
				if (isNull(module)) {
					module = cacheModule[id] = new Module(id, [], function() {
						module.exports = win[id]
					});
				}
				// cacheModule[id].script = node;
				callback()
			})
		}
	}
	function getCurrentScript() {
		currentScript = currentScript || Q("script")[0];
		return currentScript
	}
	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		isNull(id) && (id = loc.href);
		id = alias2url(id);
		id = paths2url(id);
		id = vars2url(id);
		id = normalize(id);
		return map2url(id)
	}
	function normalize(url) {
		!/^[a-zA-Z0-9]+:\/\//.test(url) && (url = concactUrl(config.base, url));
		return !/\?/.test(url) && !/\.(css|js)$/.test(url) ? url + ".js" : url
	}
	function alias2url(id) {
		return config.alias[id] || id;
	}
	function paths2url(id) {
		var key = id.match(/^[0-9a-zA-Z._]+/);
		key = key ? key[0] : id;
		return id.replace(new RegExp("^" + key), config.paths[key] || key)
	}
	function vars2url(id) {
		var key = id.match(/\{[0-9a-zA-Z._]+\}/);
		key = key ? key[0] : id;
		return id.replace(new RegExp(key, "g"), config.vars[key] || key)
	}
	function map2url(id) {
		each(config.map, function(i, v) {
			id.indexOf(v[0]) > -1 && id.replace(v[0], v[1])
		});
		return id
	}
	function concactUrl() {
		return Q.map(arguments, function(i, url) {
			return isArray(url) ? url.join("") : (url + "").replace(/(^\/)|(\/$)/, "")
		}).join("/")
	}
	// ////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use : use,
		// factory:function(require, exports, module)
		define : define,
		config : function(opts) {
			return Q.config(opts, config)
		}
	});
	Q.cycle(function() {
		var count = 0;
		each(cacheModule, function(key, module) {
			count++
		});
		function clear(module) {
			module.destroy();
			count--;
		}
		count > 12 && each(cacheModule, function(key, module) {
			module.useCount < 5 && clear();
			module.useCount = 0;
		})
	}, 300000);
	Q.sun = sun;
	win.define = sun.define
})(Qmik);
