/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {
	var isFun = Q.isFun, isNull = Q.isNull, now = Q.now;
	var config = {
		alias : {},//别名系统
		vars : {},//路径变量系统
		gap : 60, //单位秒,间隔多少秒回收模块,释放空间
		preload : []
	//预加载
	};
	var cacheModule = {}, //模块池
	currentScript, //当前脚本
	pres, //预加载的全路径url
	ispreload = !1;//是否加载过预加载
	var sun = {};
	function Module(url, dependencies, factory) {
		Q.extend(this, {
			id : url,
			url : url,
			dir : url.replace(/\?.*/, "").replace(/[^\/]*$/i, ""),//当前目录
			dependencies : dependencies,// 依赖模块
			factory : factory,
			// module is ready ,if no, request src from service
			isReady : !1,// is ready ,default false,
			type : Q.inArray(url, pres) >= 0 ? 2 : 1,//2:预加载的类型,1:普通类型
			exports : {},
			last : now()
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
		me.l = me.p = 0;
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
			size : function() {
				return this.l - this.p
			},
			push : function(val) {
				this[this.l++] = val
			},
			pop : function() {
				//return this.splice(0, 1)[0]
				var me = this, val = me[me.p];
				delete me[me.p++];
				return val
			},
			deal : function() {
				var me = this;
				if (me.state == 1 && me.size() > 0) {
					me._deal(me.pause().pop(), function() {
						me.notify()
					})
				}
				return me
			}
		});
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
		var module = getModule(id2url(id));
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
		var url = id2url(id), module = getModule(url);
		if (module) {
			module.isReady ? useModule(module, require, callback) : batload(function() {
				useModule(module, require, callback)
			}, module.dependencies)
		} else {
			request(url, function() {
				try {
					batload(function() {
						useModule(getModule(url), require, callback)
					}, getModule(url).dependencies)
				} catch (e) {
					Q.log("get module error:" + url);
					loadError(e);
					throw e
				}
			}, loadError)
		}
	}
	function getModule(alia) {
		return cacheModule[id2url(alia)]
	}
	function useModule(module, require, callback) {
		if (module.isReady != !0) {
			var nm = module.factory(require, module.exports, module);
			module.exports = module.exports || nm
		}
		module.isReady = !0;
		module.last = now();
		callback(module.exports)
	}
	function request(url, success, error) {
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url) : currentScript = Q.getScript(url, success, error)
	}
	function getCurrentScript() {
		return currentScript
	}
	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		id = alias2url(id);
		id = vars2url(id);
		return normalize(id)
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
			id = id.replace(new RegExp("\\" + val, "g"), config.vars[val.substring(2, val.length - 1)] || val)
		});
		return id
	}
	// ////////////////id to url end ///////////////////////////////
	Q.extend(sun, {
		use : function(ids, callback) {
			ids = Q.isArray(ids) ? ids : [
				ids
			];
			ids = Q.grep(ids, function(val) {
				return !Q.likeNull(val)
			});
			if (!ispreload) {
				queue.push({
					ids : config.preload
				});
				pres = Q.map(config.preload, function(i, val) {
					return id2url(val)
				});
				ispreload = !0
			}
			//下面检测使用的模块是否已被全部加载过
			var ret = Q.grep(ids, function(val) {
				return !isNull(getModule(id2url(val)))
			});
			ret.length == ids.length ? batload(callback, ids) : queue.push({
				ids : ids,
				callback : callback
			});
			queue.deal()
		},
		// factory:function(require, exports, module)
		define : function(dependencies, factory) {
			if (isNull(getCurrentScript())) return;
			var url = getCurrentScript().src;
			if (isFun(dependencies)) {
				factory = dependencies;
				dependencies = []
			}
			if (!getModule(url)) {
				dependencies = dependencies.concat(parseDepents(factory));
				cacheModule[url] = new Module(url, Q.unique(dependencies), factory);
				//useModule(cacheModule[url], require)
			}
		},
		config : function(opts) {//参数配置
			return Q.config(opts, config)
		},
		//输出本功能里已经有的模块对象
		getModules : getModule
	});
	//内存回收
	function gc() {
		Q.each(cacheModule, function(key, val) {
			if (val.type == 1 && now() - val.last > (config.gap || 60) * 1000) {
				try {
					delete cacheModule[key];
					Q("script[_src='" + key + "']").remove();
					val.gc && val.gc()
				} catch (e) {
				}
			}
		})
	}
	Q.cycle(gc, config.gap);
	Q.sun = sun;
	Q.define = Q.sun.define;
	Q.use = Q.sun.use;
})(Qmik);
