/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {
	var win = Q.global, loc = win.location;
	var isArray = Q.isArray, isFun = Q.isFun, isNull = Q.isNull, each = Q.each;
	var config = {
		alias : {},
		paths : {},
		vars : {},
		map : [],
		preload : []
	};
	var cacheModule = {}, currentScript, ispreload = !1;
	var sun = {};
	function Module(id, url, dependencies, factory) {
		Q.extend(this, {
			id : id || url,
			url : url,
			dir : url.replace(/(\?.*)?/, "").replace(/(\/[^\/]*)$/i, "/"),//当前目录
			dependencies : dependencies,// 依赖模块
			factory : factory,
			// module is ready ,if no, request src from service
			isReady : !1,// is ready ,default false,
			exports : {}
		})
	}
	/** 清除注释 */
	function clearNode(word) {
		return word.replace(/(\/\/)\S*[^\n]*/g, "").replace(/\/\*[\S\s]*\*\//g, "")
	}
	// get depends from function.toString()
	function parseDepents(code) {
		code = clearNode(code.toString());
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
	function QueueSync(fun) {
		var me = this;
		me._deal = fun;
		me.notify();
	}
	{
		Q.extend(QueueSync.prototype, {
			notify : function() {
				var me = this;
				me.state = 1;
				me.deal();
				return me
			},
			pause : function() {
				this.state = 2;
				return this
			},
			pop : function() {
				return this.splice(0, 1)[0]
			},
			deal : function() {
				var me = this;
				if (me.state == 1 && me.length > 0) {
					me._deal(me.pause().pop(), function() {
						me.notify()
					})
				}
				return me
			}
		});
		Q.inherit(QueueSync, Array)
	}
	var queue = new QueueSync(function(item, chain) {
		var callback = item.callback;
		batload(function() {
			callback && callback.apply(callback, arguments);
			chain()
		}, item.ids)
	});
	function loadError() {
		queue.notify()
	}
	// require module
	function require(id) {
		var module = getModule(id2url(id), id);
		return module ? module.exports : null
	}
	// bat sequence load module
	function batload(callback, deps) {
		var dependencies = deps || config.preload, length = dependencies.length, params = [];
		length == 0 ? callback() : (function bload(idx) {
			load(dependencies[idx], function(exports) {
				params.push(exports);
				idx == length - 1 ? callback.apply(callback, params) : bload(idx + 1)
			})
		})(0)
	}
	function load(id, callback) {
		var url = id2url(id);
		if (id == ".js") return;
		var module = getModule(url, id);
		if (module) {
			module.isReady ? useModule(module, require, callback) : batload(function() {
				useModule(module, require, callback)
			}, module.dependencies)
		} else {
			request(id, function() {
				try {
					batload(function() {
						useModule(getModule(url, id), require, callback)
					}, getModule(url, id).dependencies)
				} catch (e) {
					queue.notify();
					throw e
				}
			}, loadError)
		}
	}
	function getModule(url, id) {
		var module = cacheModule[url] || cacheModule[id], modules;
		if (!module) {
			modules = top != win && top.Qmik ? top.Qmik.sun.modules() : cacheModule;
			module = modules[url] || modules[id]
		}
		return module
	}
	function useModule(module, require, callback) {
		if (module.isReady != !0) {
			var nm = module.factory(require, module.exports, module);
			module.exports = module.exports || nm
		}
		module.isReady = !0;
		callback && callback(module.exports)
	}
	function request(id, success, error) {
		var url = id2url(id), loadScript = Q("script[_src='" + url + "']");
		if (/\/.+\.css$/i.test(url.replace(/(\?.*)?/i, ""))) {
			Q.getCss(url)
		} else {
			currentScript = Q.getScript(url, success, error)
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
		url = Q.url(url);
		return !/\?/.test(url) && !/\.(css|js)$/.test(url) ? url + ".js" : url
	}
	function alias2url(id) {
		return config.alias[id] || id;
	}
	function paths2url(id) {
		var keys = id.match(/^(\/?[0-9a-zA-Z._]+)/), key = keys ? keys[0] : id;
		return keys ? id.replace(new RegExp("^" + key), config.paths[key] || key) : id
	}
	function vars2url(id) {
		var key = id.match(/\{[0-9a-zA-Z._]+\}/);
		key = key ? key[0] : id;
		return id.replace(new RegExp(key, "g"), config.vars[key] || key)
	}
	function map2url(id) {
		each(config.map, function(i, v) {
			id = id.match(v[0]) ? id.replace(v[0], v[1]) : id
		});
		return id
	}
	// ////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use : function(ids, callback) {
			ids = isArray(ids) ? ids : [
				ids
			];
			if (!ispreload) {
				queue.push({
					ids : config.preload
				});
				ispreload = !0
			}
			//下面检测使用的模块是否已被全部加载过
			var ret = Q.grep(ids, function(val) {
				return !isNull(getModule(id2url(val), val))
			});
			if (ret.length == ids.length) {
				batload(callback, ids)
			} else {
				queue.push({
					ids : ids,
					callback : callback
				});
				queue.deal()
			}
		},
		// factory:function(require, exports, module)
		define : function(id, dependencies, factory) {
			var url = getCurrentScript().src;
			if (isFun(id)) {
				factory = id;
				dependencies = [];
				id = url
			} else if (isFun(dependencies)) {
				factory = dependencies;
				dependencies = []
			}
			id = id2url(id);
			if (!getModule(id) || !Q.isIE()) {
				dependencies = dependencies.concat(parseDepents(factory));
				cacheModule[url] = cacheModule[id] = new Module(id, url, Q.unique(dependencies), factory);
				useModule(cacheModule[url], require)
			}
		},
		config : function(opts) {
			return Q.config(opts, config)
		},
		url : id2url,
		modules : function() {
			return cacheModule
		}
	});
	Q.sun = sun;
	Q.define = Q.sun.define;
	Q.use = Q.sun.use;
	if (!win.define) win.define = Q.define;
	if (!win.use) win.use = Q.use;
})(Qmik);
