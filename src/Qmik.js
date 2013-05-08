/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function() {
	var win = this, doc = win.document || {}, nav = win.navigator || {}, UA = nav.userAgent;
	var encode = encodeURIComponent, decode = decodeURIComponent, config = {};
	var slice = Array.prototype.slice;
	// define qmik object
	function Q(selector, context) {
		return Q.init(selector, context)
	}
	Q.extend = function() {
		var ret = arguments[0] || {}, i = 1;
		switch (arguments.length) {
		case 0:
			return;
		case 1:
			ret = this;
			i = 0;
			break
		}
		each(slice.call(arguments, i), function(j, v) {
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
		return isArray(v) || (v && !isDom(v) && !isString(v) && isNum(v.length) && v != win)
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
		if (likeArray(obj)) for (i = 0; i < obj.length; i++) {
			if (callback.call(obj[i], i, obj[i]) === !1) break
		}
		else if (isObject(obj)) {
			for (i in obj) {
				if (callback.call(obj[i], i, obj[i]) === !1) break
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
		// if (isString(v) && v.match(/^\s*[\[{].*[\]}]\s*$/)) return Q.exec('(' +
		// v + ')')
		return JSON.parse(v)
	}
	function isEvent(e) {
		return win.Event && e instanceof win.Event || e == win.event
	}
	function execObject(v, target) {
		return isFun(v) ? (target ? v.call(target, v) : v()) : v
	}
	function merge() { // merge array or object
		var array = arguments[0], isA = isArray(array), i = 1;
		for (; i < arguments.length; i++) {
			each(arguments[i], function(k, v) {
				isA ? array.push(v) : array[k] = v
			})
		}
		return array
	}
	function isGrandfather(grandfather, child) {
		return isDom(child) && (grandfather === child.parentNode ? !0 : isGrandfather(grandfather, child.parentNode))
	}
	Q.extend( {
		encode : encode,
		decode : encode,
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
		likeNull : function() {
			return isNull(v) || (isString(v) && (v == "undefined" || v == "null" || v.trim() == ""))
		},
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
			return v ? v.trim() : v
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
			for ( var i = array.length - 1, j; i >= 0; i--)
				for (j = i - 1; j >= 0; j--)
					array[i] === array[j] && array.splice(i, 1)
		},
		contains : isGrandfather,
		map : function(array, callback) {
			var r = [];
			each(array, function(i, v) {
				r.push(callback(i, v))
			});
			return r
		},
		getScript : function(url, callback) {
			var s = doc.createElement("script");
			s.type = "text/javascript";
			s.src = url;
			s.defer = "defer";
			Q(doc.head).append(s);
			s.onload = s.onreadystatechange = callback
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
			return /i(Phone|P(o|a)d)/.test(UA)
		},
		isAndroid : function() {
			return /Android/.test(UA)
		},
		isWP : function() {
			return /Windows Phone/.test(UA)
		},
		config : function(key, value) {
			isObject(key) ? Q.extend(config, key) : isString(key) && (config[key] = value);
			return isString(key) ? config[key] : config
		}
	});
	Q.version = "1.00.001";
	Q.global = win;
	win.Qmik = Q;
	win.$ = win.$ || Q;
	return Q;
})();
