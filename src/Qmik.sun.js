/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
;
(function(Q) {
	var isFun = Q.isFun,
		execCatch = Q.execCatch,
		win = Q.global,
		NULL = null;
	var config = {
		alias: {}, //别名系统
		vars: {}, //路径变量系统
		preload: [] //预加载
	};
	var cacheModule = {}, //模块池
		currentScript, //当前脚本
		ispreload = !1; //是否加载过预加载
	var sun = {};

	function Module(url, dependencies, factory) {
		Q.extend(this, {
			id: url,
			url: url,
			dependencies: dependencies, // 依赖模块
			factory: factory,
			// module is ready ,if no, request src from service
			state: 3, // is ready ,default false, 1=ok,2=准备中,3=寻找模块
			type: Q.inArray(url, config.preload) >= 0 ? 2 : 1, //2:预加载的类型,1:普通类型
			exports: {}
		})
	}
	/** 清除注释 */
	function clearNode(word) {
		/*return word.replace(/(\/\/[^\n]*)|(\/\*[^\n]*\*\/)|(["'][^"'\n]*["'])/g, function(val){
			return /[\(\)]/.test(val) ? "" : val;
		}).replace(/(\/\*.*\*\/)|(\/\*[\S\s]*\*\/)/g, "")*/
		var list = [];
		Q.each(word.replace(/(\/\/[^\n]*)|(\/\*[^\n]*\*\/)|(["'][^"'\n]*["'])/g, function(val) {
			return /[\(\)\*]/.test(val) ? "" : val; //.replace(/\*/g,"");
		}).replace(/\/\*.*\*\//g, "").split(/\*\//), function(i, val) {
			list.push(val.replace(/\/\*[\s\S]+/, ""))
		});
		return list.join("");

	}
	// get depends from function.toString()
	function parseDepents(code) {
		code = clearNode(code.toString());
		var params = code.replace(/^\s*function\s*\w*\s*/, "").match(/^\([\w ,]*\)/)[0].replace("\(", "").replace("\)", "");
		var match = [],
			idx = params.indexOf(",");
		var require = params.substring(0, idx>0 ? idx : params.length),
			pattern = new RegExp(require + "\s*[(]\s*[\"']([^\"'\)]+)[\"']\s*[)]", "g");
		if(require)
			match = Q.map(code.match(pattern), function(i, v) {
				return v.replace(new RegExp("^" + require + "\s*[(]\s*[\"']"), "").replace(/\s*[\"']\s*[)]$/, "")
			});
		
		return match
	}

	function QueueSync(fun) {
		var me = this;
		me._deal = fun;
		me.l = me.p = 0;
		me.state = 1;
		me.deal();
	}
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

	var queue = new QueueSync(function(item, chain) {
		var callback = item.callback;
		batload(callback, item.ids, NULL, chain)
	});

	// require module
	function require(id) {
		var module = requireModule(id);
		return module ? module.exports : NULL
	}

	function requireModule(id) {
		//如果已定义了模块,就返回,否则转换名称系统,取映射的名称,再取模块
		return cacheModule[id] || cacheModule[getDemainPath(id2url(id))];
	}
	// bat sequence load module
	function batload(callback, deps, refer, chain) {
		var tasks = [];
		var params = [];
		Q.each(deps, function(i, id) {
			tasks.push(function(cb) {
				load(id, function(exports, err) {
					params.push(exports);
					cb(err);
				}, refer);
			});
		});
		Q.series(tasks, function(err) {
			execCatch(function() {
				err || (callback && callback.apply(callback, params))
			});
			chain && chain();
		});
	}

	function load(id, callback, refer) {
		var module = requireModule(id);
		module ? useModule(module, require, callback, refer) : request(id, function() {
			module = requireModule(id);
			module ? useModule(module, require, callback, refer) : loadModuleError(id, callback)
		}, function() {
			loadModuleError(id, callback)
		})
	}
	function loadModuleError(id,callback){
		callback(NULL, new Error("load module is error " + id))
	}
	//取得url的域名+路径,去掉参数及hash(frament)
	function getDemainPath(url) {
		return url.replace(/[\?#].*$/g, "");
	}

	function makeFactory(module) {
		if (!module.isMake) {
			module.isMake = !0;
			exports = module.factory(require, module.exports, module);
			Q.isNull(exports) || (module.exports = exports);
		}
		return module.exports;
	}

	function useModule(module, require, callback, refer) {
		switch (module.state) {
			case 1:
				callback(module.exports)
				break;
			case 2:
				refer && callback(makeFactory(module));
				break;
			case 3:
				module.state = 2;
				batload(function() {
					module.state = 1; //ok
					callback(makeFactory(module));
				}, module.dependencies, module);
				break;
		}
	}

	function request(url, success, error) {
		currentScript = id2url(url);
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url, error, error) : Q.getScript(currentScript, success, error)
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
		/*Q.each(id.match(/\$\{[0-9a-zA-Z._-]+\}/g) || [], function(i, val) {
			var tmp = config.vars[val.substring(2, val.length - 1).trim()] || val;
			id = id.replace(new RegExp("\\" + val, "g"), isFun(tmp) ? tmp() : tmp)
		});
		return id*/
		return id.replace(/\$\{[0-9a-zA-Z._-]+\}/g, function(val) {
			var tmp = config.vars[val.substring(2, val.length - 1).trim()] || val;
			return isFun(tmp) ? tmp() : tmp;
		});
	}

	function checkLegalId(id) {
		if (/[\)\(\*]/.test(id)) throw new Error("define id:" + id + " is Illegal,not contain )(*");
	}
	// ////////////////id to url end ///////////////////////////////
	function define(id, url, dependencies, factory) {
		checkLegalId(id);
		checkLegalId(url);
		return cacheModule[id] = cacheModule[url] = new Module(id, dependencies, factory);
	}
	Q.extend(sun, {
		use: function(ids, callback) {
			Q.delay(function() {
				ids = Q.isArray(ids) ? ids : [
					ids
				];
				if (!ispreload) {
					queue.push({
						ids: config.preload
					});
					ispreload = !0
				}
				//下面检测使用的模块是否已被全部加载过
				var ret = [];
				Q.each(ids, function(i, val) {
					var module = requireModule(val) || {};
					module.state == 1 && ret.push(require(val));
				});
				ret.length == ids.length ? callback && callback.apply(callback, ret) : queue.push({
					ids: ids,
					callback: callback
				});
				queue.deal()
			}, 1);
		},
		// factory:function(require, exports, module)
		define: function(uid, dependencies, factory) {
			var url, module;
			if (currentScript) url = currentScript;
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
			define(uid, getDemainPath(url || uid), dependencies, factory);
			currentScript = NULL;
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
	win.define = win.define || Q.define;//如果外面没有引入其它cmd框架,设置全局变量define
	Q.use = Q.sun.use;
})(Qmik);