/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
;(function(Q) {
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
	readModuleName,//读取
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
			try{
				callback && callback.apply(callback, arguments);
			}catch(e){
				console.log("exec modules is error:",item.ids,callback.toString());
			}
			chain()
		}, item.ids)
	});
	function loadError(e) {
		console.error(readModuleName,e);
		queue.notify()
	}
	// require module
	function require(id) {
		var module = cacheModule[id2url(id)];
		return module ? module.exports : null
	}
	// bat sequence load module
	function batload(callback, deps) {
		var dependencies = deps || config.preload, length = dependencies.length, params = [];
		length == 0 ? callback && callback() : (function bload(idx) {
			load(dependencies[idx], function(exports) {
				params.push(exports);
				if(idx == length - 1){
					try{
						callback && callback.apply(callback, params)
					}catch(e){
						console.log(e, e.stack)
					}
				}else{
					bload(idx + 1)
				}
				//idx == length - 1 ? callback && callback.apply(callback, params) : bload(idx + 1)
			})
		})(0)
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
					console.log("get module error:" + moduleName);
					loadError(e);
				}
			}, loadError)
		}
	}
	//取得url的域名+路径,去掉参数及hash(frament)
	function getDemainPath(url){
		return url.replace(/[\?#].*$/,"");
	}
	function useModule(module, require, callback) {
		try{
			if (module.isReady != !0) {
				var nm = module.factory(require, module.exports, module);				
				module.exports = module.exports || nm
			}
			module.isReady = !0;
			module.last = now();
		}catch(e){
			console.log("module isError[", module.id, "],exports set null" ,e);
		}
		callback(module.exports)
	}
	function request(url, success, error) {
		/\/.+\.css(\?.*)?$/i.test(url) ? Q.getCss(url,error,error) : currentScript = Q.getScript(url, success, error)
	}
	function getCurrentScript() {
		return currentScript
	}
	// //////////////// id to url start ///////////////////////////////
	function id2url(id) {
		var url = alias2url(id);
		if(url == id)return id;
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
		use : function(ids, callback) {
			ids = Q.isArray(ids) ? ids : [
				ids
			];
			ids = Q.map(ids, function(i, val) {
				return id2url(val)
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
			var ret = Q.grep(ids, function(i,val) {
				return !isNull(cacheModule[val])
			});
			ret.length == ids.length ? batload(callback, ids) : queue.push({
				ids : ids,
				callback : callback
			});
			queue.deal()
		},
		// factory:function(require, exports, module)
		define : function(uid, dependencies, factory) {
			var url, module;
			if(getCurrentScript()) url = getCurrentScript().src;
			if (Q.isFun(uid) || Q.isArray(uid)) {
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
			for(var i=0;i<dependencies.length;i++){
				dependencies[i]=id2url(dependencies[i]);
			}
			if(uid){
				cacheModule[uid] && console.log("warn module is overwrited:",uid,",",factory);
				cacheModule[uid] = new Module(uid, dependencies, factory)		
			}
			if(url){
				var moduleName = getDemainPath(url);
				!cacheModule[moduleName] && (cacheModule[moduleName] = new Module(moduleName, dependencies, factory));
			}
		},
		config : function(opts) {//参数配置
			return Q.config(opts, config)
		},
		modules : function(){
			return Q.extend({},cacheModule)
		}
	});
	Q.sun = sun;
	Q.define = Q.sun.define;
	Q.use = Q.sun.use;
})(Qmik);
