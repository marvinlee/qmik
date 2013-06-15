/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function() {
	var win = this, doc = win.document || {}, nav = win.navigator || {}, UA = nav.userAgent, loc = win.location;
	var encode = encodeURIComponent, decode = decodeURIComponent, //
	baseURL = loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : ""), //
	config = {
		context : "/",//工程上下文目录
		box : {
			enable : !1,//对box异常收集的支持
			ttl : 60000,//收集时间间隔
			url : "" //收集地址
		}
	};
	var slice = Array.prototype.slice;
	var readyRE = /complete|loaded|interactive/i;
	// define qmik object
	function Q(selector, context) {
		return Q.init(selector, context)
	}
	Q.extend = function() {
		var args = arguments, ret = args[0] || {}, i = 1;
		switch (args.length) {
		case 0:
			return;
		case 1:
			ret = this;
			i = 0;
			break
		}
		each(slice.call(args, i), function(j, v) {
			v && each(v, function(key, val) {
				isNull(val) || (ret[key] = val)
			})
		});
		return ret
	}
	Q.extend(String.prototype, {
		trim : function() {
			return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "")
		},
		toLower : function() {
			return this.toLowerCase()
		},
		toUpper : function() {
			return this.toUpperCase()
		}
	});
	function filter(array, callback) {
		var ret = [];
		each(array, function(i, v) {
			(callback ? callback(v) : !isNull(v)) && ret.push(v)
		});
		return ret
	}
	// public function
	// ///////////////////////////////////////////////////////////////////
	// isNull
	function isNull(v) {
		return v === undefined || v === null
	}
	function likeNull(v) {
		return isNull(v) || (isString(v) && (v == "undefined" || v == "null" || v.trim() == ""))
	}
	// isString
	function isString(v) {
		return typeof v == 'string'
	}
	// isDom
	function isDom(v) {
		return v && v.nodeType == 1
	}
	// isArray
	function isArray(v) {
		return v instanceof Array
	}
	function likeArray(v) { // like Array
		return isArray(v) || (!isString(v) && (v + "" == "[object NodeList]" || v + "" == "[object HTMLCollection]")) || (Q.isQmik && Q.isQmik(v))
	}
	// isFunction
	function isFun(v) {
		return v instanceof Function
	}
	function isError(v) {
		return v instanceof Error
	}
	function isObject(v) {
		return v instanceof Object
	}
	function each(obj, callback) { // each fun(k,v)
		var i;
		if (likeArray(obj)) {
			for (i = 0; i < obj.length; i++) {
				callback.call(obj[i], i, obj[i])
			}
		} else if (isObject(obj)) {
			for (i in obj) {
				callback.call(obj[i], i, obj[i])
			}
		}
	}
	// isNumber
	function isNum(v) {
		return typeof v == 'number'
	}
	function isBool(v) {
		return typeof v == 'boolean'
	}
	function isBaseType(v) {
		return isBool(v) || isString(v) || isNum(v)
	}
	function toString(v) {
		return isBaseType(v) ? v : isFun(v) ? v.toString() : JSON.stringify(v)
	}
	// to json
	function toJSON(v) {
		// return Q.exec('(' + v + ')')
		return JSON.parse(v)
	}
	function isEvent(e) {
		return win.Event && e instanceof win.Event || e == win.event
	}
	function execObject(v, target) {
		return isFun(v) ? (target ? v.call(target, v) : v()) : v
	}
	function merge() { // merge array or object
		var args = arguments, array = args[0], isA = isArray(array), i = 1;
		for (; i < args.length; i++) {
			each(args[i], function(k, v) {
				isA ? array.push(v) : array[k] = v
			})
		}
		return array
	}
	function isGrandfather(grandfather, child) {
		return isDom(child) && (grandfather === child.parentNode ? !0 : isGrandfather(grandfather, child.parentNode))
	}
	// 合并url,参数个数不限
	function concactUrl() {
		return Q.map(arguments, function(i, url) {
			return isArray(url) ? url.join("") : url
		}).join("/").replace(/(^\w+:\/\/)|([\/]{2,})/g, function(v) {
			return !/^\w+:\/\//.test(v) ? "/" : v
		})
	}
	function loadResource(type, url, success, error) {
		var isCss = type == "css", tagName = isCss ? "link" : "script", //
		node = Q(doc.createElement(tagName)), state, noExec = !0 // is execed;
		node.attr("_src", url);
		isCss ? node.attr("rel", "stylesheet") : node.attr("type", "text/javascript");
		function _error(e) {
			node.remove();
			error && error(e)
		}
		function load(e) {
			state = node[0].readyState;
			if (noExec && (likeNull(state) || readyRE.test(state))) {
				noExec = !1;
				Q.box(success)(e)
			}
		}
		node.on("load", load).on("readystatechange", load).on("error", _error);
		Q("head").append(node);
		return node
	}
	//box bariable
	var errorStack = {
		count : 0
	};
	Q.extend( {
		encode : encode,
		decode : decode,
		isDom : isDom,
		isBool : isBool,
		isString : isString,
		isFun : isFun,
		isFunction : isFun,
		isNum : isNum,
		isNumber : isNum,
		isArray : isArray,
		isNull : isNull,
		likeArray : likeArray,
		isError : isError,
		each : each,
		stringify : toString,
		parseJSON : toJSON,
		isEvent : isEvent,
		likeArray : function(v) { // like Array
			return isArray(v) || (v && !isDom(v) && !isString(v) && isNum(v.length) && v != win)
		},
		isDate : function(v) {
			return v instanceof Date
		},
		isObject : isObject,
		isPlainObject : function(v) { // isPlainObject
			if (isNull(v) || v + '' != '[object Object]' || v.nodeType || v == win) return !1;
			var k;
			for (k in v) {
			}
			return isNull(k) || Object.prototype.hasOwnProperty.call(v, k)
		},
		likeNull : likeNull,
		/**
		 * 继承类 子类subClass继承父类superClass的属性方法, 注:子类有父类的属性及方法时,不会被父类替换
		 */
		inherit : function(subClass, superClass) {
			function F() {
			}
			var subPrototype = subClass.prototype;
			F.prototype = superClass.prototype;
			subClass.prototype = new F();
			subClass.prototype.constructor = subClass;
			subClass._super = superClass.prototype;
			if (superClass.prototype.constructor == Object.prototype.constructor) {
				superClass.prototype.constructor = superClass;
			}
			for ( var name in subPrototype) {
				if (subClass.prototype[name] == null) subClass.prototype[name] = subPrototype[name];
			}
		},
		trim : function(v) {
			return isNull(v) ? "" : isString(v) ? v.trim() : v.toString().trim()
		},
		toLower : function(v) {
			return v ? v.toLower() : v
		},
		toUpper : function(v) {
			return v ? v.toUpper() : v
		},
		// 合并数组或对象
		merge : merge,
		array : function(array) {
			return merge( [], array)
		},
		inArray : function(value, array) {
			if (Q.likeArray(array)) for ( var i = 0; i < array.length; i++)
				if (array[i] === value) return i;
			return -1
		},
		unique : function(array) {
			var ret = [];
			each(array, function(i, value) {
				Q.inArray(value, ret) < 0 && ret.push(value)
			});
			return ret
		},
		contains : isGrandfather,
		map : function(array, callback) {
			var r = [];
			each(array, function(i, v) {
				r.push(callback(i, v))
			});
			return r
		},
		getScript : function(url, success, error) {
			/*var node = doc.createElement("script"), //
			state, //
			noExec = !0 // is execed;
			Q(node).attr( {
				type : "text/javascript",
				_src : url
			});
			function _error(e) {
				Q(node).remove();
				error && error(e)
			}
			function load(e) {
				state = node.readyState;
				if (noExec && (likeNull(state) || readyRE.test(state))) {
					noExec = !1;
					Q.box(success)(e)
				}
			}
			Q(node).on("load", load).on("readystatechange", load).on("error", _error);
			Q("head").append(node);*/
			url = Q.url(url);
			var node = loadResource("js", url, success, error)[0];
			Q.delay(function() {
				node.src = url;
			}, 1);
			return node
		},
		getCss : function(url, success, error) {
			url = Q.url(url);
			return loadResource("css", url, success, error).attr("href", url)
		},
		serialize : function(array) {
			return Q.param(Q.serializeArray(array))
		},
		serializeArray : function(array) {
			return filter(array, function(v) {
				return v && v.name ? {
					name : v.name,
					value : execObject(v.value)
				} : !1
			})
		},
		grep : filter,
		// buid a new array,filter by fun
		param : function(o) {
			var h = [];
			each(o, function(i, v) {
				h.push(encode(v.name) + '=' + encode(execObject(v.value)))
			});
			return h.join('&')
		},
		now : function(d) {
			return (d || 0) + new Date().getTime()
		},
		// 延迟执行,==setTimeout
		delay : function(fun, time) {
			var params = slice.call(arguments, 2);
			return setTimeout(function() {
				fun.apply(fun, params)
			}, time)
		},
		// 周期执行,==setInterval
		cycle : function(fun, time) {
			var params = slice.call(arguments, 2);
			function _exec() {
				fun.apply(fun, params);
				Q.delay(_exec, time)
			}
			Q.delay(_exec, time)
		},
		log : function(msg, e) {
			if (config.debug) {
				msg = isError(msg) ? msg.stack : msg;
				msg += isError(e) ? e.stack : "";
				try {
					console.log(msg)
				} catch (e) {
				}
			}
		},
		isIphone : function() {
			return /iPhone OS/.test(UA)
		},
		isAndroid : function() {
			return /Android/.test(UA)
		},
		isWP : function() {
			return /Windows Phone/.test(UA)
		},
		isIE : function() {
			return /MSIE/.test(UA)
		},
		config : function(opts, _config) {
			_config = arguments.length <= 1 ? config : (_config || {});
			var ret = _config;
			if (arguments.length < 1 || isNull(opts)) {
			} else if (!isObject(opts)) {
				ret = _config[opts]
			} else {
				each(opts, function(key, val) {
					isObject(val) && _config[key] ? Q.extend(_config[key], val) : (_config[key] = val)
				})
			}
			return ret
			//return (arguments.length < 1 || isNull(opts)) ? _config : isObject(opts) ? Q.extend(_config, opts) : _config[opts]
		},
		/**
		 * 合并url,if 参数 _url为空,则
		 */
		url : function(_url) {
			_url = _url.trim();
			return arguments.length < 1 ? baseURL : !/^[a-zA-Z0-9]+:\/\//.test(_url) ? concactUrl(baseURL, (/^\//.test(_url) ? "" : config.context || "/") + "/"
																																			+ _url) : _url
		},
		box : function(callback) {
			//enable box error notify:Q.config(error,{enable,url:"send you service"});
			return config.box.enable ? function() {
				try {
					callback.apply(this, arguments)
				} catch (e) {
					// Q.config(error,{enable,url:""});
					//enable support box error send to service
					var stack = e.stack, log = errorStack[stack];
					if (log) {
						log.num++
					} else {
						log = errorStack[stack] = {
							num : 1
						};
						errorStack.count++
					}
					throw e
				}
			} : callback
		}
	});
	Q.url.toString = function() {
		return Q.url()
	};
	(function sendBox() {
		var box = config.box || {};
		if (box.enable && errorStack.count > 0) {
			var img = new Image();
			img.src = (config.error.url || "/error") + "?errorlog=" + toString(errorStack);
			delete errorStack;
			errorStack = {
				count : 0
			}
			Q.delay(sendBox, box.ttl < 10000 ? 10000 : box.ttl)
		}
	})();
	Q.version = "1.00.001";
	Q.global = win;
	win.Qmik = Q;
	win.$ = win.$ || Q;
	Q.exec = eval;
	return Q;
})();
