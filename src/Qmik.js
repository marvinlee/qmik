/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function() {
	var global = this, doc = global.document || {}, config = {};
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
	function filter(callback) {
		var ret = [];
		each(this, function(i, v) {
			callback(v) && ret.push(v)
		});
		return ret
	}
	// public function
	// ///////////////////////////////////////////////////////////////////
	// isNull
	function isNull(v) {
		return v === undefined || v == null
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
		return isArray(v) || (v && !isDom(v) && !isString(v) && isNum(v.length) && v != global)
	}
	// isFunction
	function isFun(v) {
		return v instanceof Function
	}
	function each(obj, callback) { // each fun(k,v)
		var i;
		if (likeArray(obj)) for (i = 0; i < obj.length; i++) {
			if (callback.call(obj[i], i, obj[i]) === !1) break
		}
		else if (isBS(obj) || isNum(obj) || isFun(obj)) callback.call(obj, i, obj);
		else for (i in obj) {
			if (callback.call(obj[i], i, obj[i]) === !1) break
		}
	}
	// isNumber
	function isNum(v) {
		return typeof v == 'number'
	}
	function isBool(v) {
		return typeof v == 'boolean'
	}
	function isBS(v) {
		return isBool(v) || isString(v)
	}
	function toString(v) {
		return isBS(v) || isNum(v) ? v : JSON.stringify(v)
	}
	// to json
	function toJSON(v) {
		// if (isString(v) && v.match(/^\s*[\[{].*[\]}]\s*$/)) return Q.exec('(' +
		// v + ')')
		return JSON.parse(v)
	}
	function isEvent(e) {
		return global.Event && e instanceof global.Event || e == global.event
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
	Q.extend( {
		encode : encodeURIComponent,
		decode : decodeURIComponent,
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
		each : each,
		stringify : toString,
		parseJSON : toJSON,
		// 合并数组或对象
		merge : merge,
		isEvent : isEvent,
		likeArray : function(v) { // like Array
			return isArray(v) || (v && !isDom(v) && !isString(v) && isNum(v.length) && v != global)
		},
		isDate : function(v) {
			return v instanceof Date
		},
		isObject : function(v) {
			return v instanceof Object
		},
		isPlainObject : function(v) { // isPlainObject
			if (isNull(v) || v + '' != '[object Object]' || v.nodeType || v == global) return !1;
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
		array : function(array) {
			return merge( [], array)
		},
		inArray : function(value, array) {
			if (Q.likeArray(array)) for ( var i = 0; i < array.length; i++)
				if (array[i] === value) i;
			return -1
		},
		unique : function(array) {
			for ( var i = array.length - 1, j; i >= 0; i--)
				for (j = i - 1; j >= 0; j--)
					if (array[i] === array[j]) array.splice(i, 1)
		},
		contains : function(p, c) {
			if (isDom(p) && isDom(c)) return p === c || NGP(p, c);
			for ( var k in p)
				if (p[k] === c) return !0;
			return !1
		},
		map : function(array, callback) {
			var r = [];
			each(array, function(i, v) {
				r.push(callback(i, v))
			});
			return r
		},
		getScript : function(url, callback,async) {
			var s = doc.createElement("script");
			s.type = "text/javascript";
			s.src = url;
			s.defer="defer";
			Q(doc.head).append(s);
			s.onload=s.onreadystatechange = callback
		},
		serialize : function(a) {
			return Q.param(Q.serializeArray(a))
		},
		serializeArray : function(a) {
			return toV(a, function(v) {
				return v && v.name ? {
					name : v.name,
					value : execObject(v.value)
				} : !1;
			})
		},
		grep : function(array, callback) {
			return filter.call(array, function(v) {
				return callback ? callback(v) : !isNull(v)
			})
		},
		// buid a new array,filter by fun
		param : function(o) {
			var h = [];
			each(o, function(i, v) {
				h.push(e(v.name) + '=' + e(execObject(v.value)))
			});
			return h.join('&')
		},
		time : function(d) {
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
			function _exec(){
				fun.apply(fun, params)
				Q.delay(_exec,time);
			}
			Q.delay(_exec,time)
		},
		log : function(msg, e) {
			if (Q.config().debug) {
				var m;
				if (msg instanceof Error) {
					e = msg;
					m = e.stack;
					msg = undefined
				} else {
					m = msg || ""
				}
				try {
					console.log(m)
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
			if (isPlainObject(k)) Q.extend(config, k);
			else if (arguments.length > 1) config[key] = value;
			return isString(key) ? config[key] : Q
		}
	});
	Q.version = "1.00.001";
	Q.global = global;
	global.Qmik = Q;
	global.$ = global.$ || Q;
	return Q;
})();
