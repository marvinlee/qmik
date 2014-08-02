/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
;
(function(Q) {
	var isFun = Q.isFun,
		isNull = Q.isNull,
		now = Q.now;
	var config = {
		alias: {}, //别名系统
		vars: {}, //路径变量系统
		preload: []
		//预加载
	};
	var cacheModule = {}, //模块池
		currentScript, //当前脚本
		pres, //预加载的全路径url
		readModuleName, //读取
		ispreload = !1; //是否加载过预加载
	var sun = {};

	function Module(url, dependencies, factory) {
		Q.extend(this, {
			id: url,
			url: url,
			dependencies: dependencies, // 依赖模块
			factory: factory,
			// module is ready ,if no, request src from service
			isReady: !1, // is ready ,default false,
			type: Q.inArray(url, pres) >= 0 ? 2 : 1, //2:预加载的类型,1:普通类型
			exports: {}
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
		var match = [],
			idx = params.indexOf(",");
		if (idx >= 0) {
			var require = params.substring(0, idx),
				pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
			match = Q.map(code.match(pattern), function(i, v) {
				return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
			})
		}
		return match
	}

	function QueueSync(fun) {
		var me = this;
		me._deal = fun;
		me.l = me.p = 0;
		me.state = 1;
		me.deal();
	} {
		Q.extend(QueueSync.prototype, {
			pause: function() {
				this.state = 2;
				return this
			},
			size: function() {
				return this.l - this.p
			},
			push: function(val) {
				this[this.l++] = val
			},
			pop: function() {
				var me = this,
					val = me[me.p];
				delete me[me.p++];
				return val
			},
			deal: function() {
				var me = this;
				if (me.state == 1 && me.size() > 0) {
					me._deal(me.pause().pop(), function() {
						me.state = 1;
						me.deal();
					})
				}
				return me
			}
		});
	}
	var queue = new QueueSync(function(item, chain) {
		var callback = item.callback;
		batload(callback, item.ids, chain)
	});

	function loadError(e) {
		Q.log(readModuleName, e, e.stack);
		queue.deal()
	}
	// require module
	function require(id) {
		var module = cacheModule[id2url(id)];
		return module ? module.exports : null
	}
	// bat sequence load module
	function batload(callback, deps, chain) {
		var tasks = [];
		var params = [];
		Q.each(deps, function(i, url) {
			tasks.push(function(cb) {
				load(id2url(url), function(exports) {
					params.push(exports);
					cb();
				});
			});
		});
		Q.series(tasks, function(err) {
			try {
				err ? Q.log("use modules", deps, " is error:", err.stack, err) :
					callback.apply(callback, params);
			} catch (e) {
				Q.log("use modules", deps, " is error:", e.stack, e);
			} finally {
				chain && chain();
			}
		});
	}

	function load(url, callback) {
		var moduleName = getDemainPath(url),
			module = cacheModule[moduleName];
		readModuleName = moduleName;
		if (module) {
			module.isReady ? useModule(module, require, callback) : batload(function() {
				useModule(module, require, callback)
			}, module.dependencies)
		} else {
			request(url, function() {
				try {
					batload(function() {
						useModule(cacheModule[moduleName], require, callback)
					}, cacheModule[moduleName].dependencies)
				} catch (e) {
					Q.log("get module error:", moduleName, e, e.stack);
					loadError(e);
				}
			}, loadError)
		}
	}
	//取得url的域名+路径,去掉参数及hash(frament)
	function getDemainPath(url) {
		return url.replace(/[\?#].*$/, "");
	}

	function useModule(module, require, callback) {
		if (module.isReady != !0) {
			var nm = module.factory(require, module.exports, module);
			module.exports = module.exports || nm
		}
		module.isReady = !0;
		callback(module.exports)
	}

	function request(url, success, error) {
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url, error, error) : currentScript = Q.getScript(url, success, error)
	}

	function getCurrentScript() {
		return currentScript
	}
	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		var url = alias2url(id);
		if (url == id) return id;
		url = vars2url(url);
		return normalize(url)
	}

	function normalize(url) {
		return Q.url(!/\?/.test(url) && !/\.(css|js)$/.test(url) ? url + ".js" : url)
	}
	/** 别名转url */
	function alias2url(id) {
		return config.alias[id] || id
	}
	//变量转url
	function vars2url(id) {
		Q.each(id.match(/\$\{[0-9a-zA-Z._]+\}/g) || [], function(i, val) {
			var tmp = config.vars[val.substring(2, val.length - 1)] || val;
			id = id.replace(new RegExp("\\" + val, "g"), Q.isFun(tmp) ? tmp() : tmp)
		});
		return id
	}
	// ////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use: function(ids, callback) {
			ids = Q.isArray(ids) ? ids : [
				ids
			];
			if (!ispreload) {
				queue.push({
					ids: pres
				});
				ispreload = !0
			}
			//下面检测使用的模块是否已被全部加载过
			var ret = Q.grep(ids, function(i, val) {
				return !isNull(cacheModule[val])
			});
			ret.length == ids.length ? batload(callback, ids) : queue.push({
				ids: ids,
				callback: callback
			});
			queue.deal()
		},
		// factory:function(require, exports, module)
		define: function(uid, dependencies, factory) {
			var url, module;
			if (getCurrentScript()) url = getCurrentScript().src;
			if (isFun(uid) || Q.isArray(uid)) {
				factory = dependencies;
				dependencies = uid;
				uid = "";
			}
			if (isFun(dependencies)) {
				factory = dependencies;
				dependencies = []
			}
			dependencies = dependencies.concat(parseDepents(factory));
			dependencies = Q.unique(dependencies);
			if (uid) {
				cacheModule[uid] && Q.log("warn module is overwrited:", uid, ",", factory);
				cacheModule[uid] = new Module(uid, dependencies, factory)
			}
			if (url) {
				var moduleName = getDemainPath(url);
				!cacheModule[moduleName] && (cacheModule[moduleName] = new Module(moduleName, dependencies, factory));
			}
		},
		config: function(opts) { //参数配置
			return Q.config(opts, config)
		},
		modules: function() {
			return Q.extend({}, cacheModule)
		}
	});
	Q.sun = sun;
	Q.define = Q.sun.define;
	Q.use = Q.sun.use;
})(Qmik);