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
		return isArray(v) || (!isString(v) && (v + "" == "[object NodeList]" || v + "" == "[object HTMLCollection]"))
					|| (Q.isQmik && Q.isQmik(v))
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
	var errorStack = {
		count : 0
	};
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
		likeNull : function(v) {
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
		getScript : function(url, callback) {
			var node = doc.createElement("script");
			node.type = "text/javascript";
			node.src = url;
			Q("head").append(node);
			node.onload = node.onreadystatechange = callback;
			return node
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
		config : function(opts, _config) {
			if (isNull(opts)) return _config;
			_config = arguments.length == 1 ? config : (_config || {});
			return isObject(opts) ? Q.extend(_config, opts) : _config[opts]
		},
		box : function(callback, opts) {
			return function() {
				try {
					callback.apply(this, arguments)
				} catch (e) {
					// Q.config(error,{enable,url:""});
					var stack = e.stack, log = errorStack[stack];
					if (log) {
						log.num++
					} else {
						log = errorStack[stack] = {
							num : 1
						};
						errorStack.count++;
						Q.extend(log, opts)
					}
					throw e
				}
			}
		}
	});
	function errorlog() {
		var econfig = config.error || {};
		if (errorStack.count > 0) {
			if (econfig.enable) {
				var img = new Image();
				img.src = (config.error.url || "/error") + "?errorlog=" + toString(errorStack)
			}
			errorStack = {
				count : 0
			}
		}
		Q.delay(errorlog, econfig.ttl || 60000)
	}
	errorlog();
	Q.version = "1.00.001";
	Q.global = win;
	win.Qmik = Q;
	win.$ = win.$ || Q;
	return Q;
})();

/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.37
 */
(function(Q) {
	var win = Q.global, doc = win.document, protoArray = Array.prototype;
	var isNull = Q.isNull, isDom = Q.isDom, each = Q.each, likeArray = Q.likeArray, isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun, isPlainObject = Q.isPlainObject, trim = Q.trim, replace = function(value, str1, str2) {
		return value.replace(str1, str2)
	}, toJSON = Q.parseJSON, toLower = Q.toLower, toUpper = Q.toUpper;
	var rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/, match = {
		ID : /^#[\w-_\u00c0-\uFFFF]+/,
		ATTR : /^([\w-_]+)\[\s*[\w-_]+\s*!?=\s*('|")?(.*)('|")?\s*\]/,
		CT : /^([\w-_]+)?\.[\w-_]+/,
		TAG : /^[\w-_]+/
	};
	// init node list
	/*
	 * (function(list) { for ( var ind in list) { list[ind] &&
	 * (list[ind].prototype.slice = Array.prototype.slice) } })( [ win.NodeList,
	 * win.HTMLCollection ]);
	 */
	function Query(selector, context) {
		var me = this, r;
		me.context = context = context || doc;
		me.selector = selector;
		me.length = 0;
		if (isString(selector)) {
			if (rNode.test(selector)) {
				var t = doc.createElement('div');
				t.innerHTML = selector;
				r = t.childNodes
			} else {
				r = context.querySelectorAll ? context.querySelectorAll(selector) : find(selector, context)
			}
		} else {
			r = likeArray(selector) ? selector : [
				selector
			];
			r = (r + "" == "[object Text]") ? [] : r
		}
		r = r || [];
		for ( var i = 0; i < r.length; i++) {
			r[i] && me.push(r[i])
		}
		return me
	}
	Q.extend(Query.prototype, {
		push : function(v) {
			this[this.length++] = v
		}
	});
	// Q.inherit(Query, Array);
	function init(selector, context) {
		context = context || doc;
		if (isFun(selector)) { return Q(doc).ready(selector) }
		return isQmik(selector) ? selector : new Query(selector, context)
	}
	function isQmik(v) {
		return v instanceof Query
	}
	function find(selector, context, childs) {
		var nselector = trim(selector), r = [], length;
		if (isQmik(context)) {
			each(context, function(i, v) {
				isDom(v) && (r = r.concat(find(selector, v)))
			});
		} else {
			childs = childs || compile(nselector);// 编译查询条件，返回[{type,query,isChild}...]
			length = childs.length;
			if (length >= 1) {
				r = findHandle(context, childs[0]);
				if (isNull(r) || length < 2) return r;
				nselector = childs[1].query;
				if (nselector != '') {
					var rs = [];
					childs.shift();
					each(r, function(k, x) {
						each(find(nselector, x, childs), function(o, p) {
							Q.inArray(p, rs) < 0 && rs.push(p)
						})
					});
					r = rs
				}
			}
		}
		return r
	}
	function execObject(v, target) {
		return isFun(v) ? (target ? v.call(target, v) : v()) : v
	}
	function aslice(start, length) {
		var r = [], size = start + length, me = this;
		for ( var i = start; i < size && i < me.length; i++)
			r.push(me[i]);
		return r
	}
	// As much as possible to Array
	function muchToArray(a) {
		a.slice = isArray(a) ? a.slice : aslice;
		return isArray(a) ? a : a.slice(0, a.length)
	}
	// 具体的实现查找
	function findHandle(context, qa) {
		var q = qa.query, r = [];
		if (qa.isChild) {
			var cs = muchToArray(context.childNodes);
			each(cs, function(i, dom) {
				if (isDom(dom)) {
					switch (qa.type) {
					case 'ID':
						at(dom, "id") == q && r.push(dom);
						break
					case 'ATTR':
						var ds = getTagAttr(q), k = ds[1], v = ds[2], bi;
						if (ds[3] == 1) bi = at(dom, k) == v;
						else bi = at(dom, k) != v;
						dom.tagName == toUpper(ds[0]) && bi && r.push(dom);
						break
					case 'CT':
						var ds = getTagClass(q), tn = ds[0], cn = ds[1];
						// if (tn) (dom.tagName == toUpper(tn) && hasClass(dom, cn))
						// && r.push(dom);
						// else hasClass(dom, cn) && r.push(dom);
						tn ? dom.tagName == toUpper(tn) && hasClass(dom, cn) && r.push(dom) : hasClass(dom, cn) && r.push(dom)
						break
					case 'TAG':
						dom.tagName == toUpper(q) && r.push(dom);
						break
					}
				}
			})
		} else {
			switch (qa.type) {
			case 'ID':
				r = byId(context, q);
				break
			case 'ATTR':
				r = byAttr(context, q);
				break
			case 'CT':
				var sq = getTagClass(q), tag = sq[0] || "", className = sq[1];
				r = SE() ? function() {
					var a = muchToArray(context.getElementsByClassName(className) || []), g = toUpper(tag);
					tag != "" && each(a, function(i, dom) {
						if (dom.tagName != g) a.splice(i, 1)
					});
					return a
				}() : byAttr(context, tag + "[class=" + className + "]");
				break
			case 'TAG':
				r = muchToArray(context.getElementsByTagName(q));
				break
			}
		}
		return r
	}
	function at(target, name) {
		return target[name] || target.getAttribute(name)
	}
	function findMath(array, name, value, isEqual) {
		var exist, attribute, ret = [], isClass = name == "class";
		each(array, function(i, n) {
			if (isDom(n)) {
				attribute = at(n, name);
				// attribute = attribute ? attribute : (isClass ? n.className :
				// attribute);
				attribute = isClass ? n.className : attribute;
				exist = isClass ? new RegExp(replace(value, /[ ]/g, "|")).test(attribute) : attribute == value;
				isEqual ? exist && ret.push(n) : !exist && ret.push(n);
			}
		});
		return ret
	}
	function byId(dom, selector) {
		selector = replace(selector, /^#/, "");
		var ret = doc.getElementById(selector);
		return isNull(ret) ? [] : dom == doc ? [
			ret
		] : byAttr(dom, "[id=\"" + selector + "\"]")
	}
	function byAttr(dom, selector) {
		var st = getTagAttr(selector);
		return findMath(muchToArray(dom.getElementsByTagName(st[0] || "*")), st[1], st[2], selector.indexOf('!=') == -1)
	}
	// /////////////////////////////////////////////////
	function hasClass(o, cn) {
		if (!isDom(o)) return !1;
		var cs = o.className.split(" "), cn = trim(cn), i = 0;
		for (; i < cs.length; i++)
			if (cs[i] == cn) return !0;
		return !1
	}
	function formateClassName(v) {
		return replace(v, /[A-Z]/g, function(v) {
			return "-" + toLower(v)
		})
	}
	function SE() {
		return !isNull(doc.addEventListener)
	}
	function muchValue2Qmik(c) {
		c = execObject(c);
		return isString(c) && rNode.test(c) ? Q(c) : c
	}
	function append(o, child) {
		child = muchValue2Qmik(child);
		if (likeArray(o)) {
			each(o, function(k, v) {
				append(v, child)
			})
		} else if (isDom(o)) {
			likeArray(child) ? each(child, function(k, v) {
				append(o, v)
			}) : o.appendChild(isDom(child) ? child : doc.createTextNode(child))
		}
	}
	function before(o, child) {
		child = muchValue2Qmik(child);
		if (likeArray(o)) {
			each(o, function(k, v) {
				before(v, child)
			})
		} else if (isDom(o)) {
			likeArray(child) ? each(child, function(k, v) {
				before(o, v)
			}) : o.parentNode.insertBefore(isDom(child) ? child : doc.createTextNode(child), o)
		}
	}
	function after(o, child) {
		if (isDom(o)) {
			var n = GN(o);
			n ? before(n, child) : append(o.parentNode, child)
		} else if (likeArray(o)) {
			each(o, function(i, v) {
				after(v, child)
			})
		}
	}
	function css(o, k, v) {
		k = isString(k) && !isNull(v) ? toJSON('{"' + k + '":"' + execObject(v) + '"}') : k;
		if (likeArray(o)) {
			if (isString(k)) return css(o[0], k);
			each(o, function(i, j) {
				css(j, k)
			})
		} else if (isDom(o)) {
			if (isString(k)) return o.style[formateClassName(k)];
			v = "";
			each(k, function(i, j) {
				v += formateClassName(i) + ':' + j + ';'
			});
			o.style.cssText += ';' + v
		}
	}
	function attr(target, name, val, isSetValue) {
		if (likeArray(target)) {
			if (isString(name) && isNull(val)) return attr(target[0], name, val, isSetValue);
			each(target, function(i, j) {
				attr(j, name, val, isSetValue)
			})
		} else if (!isNull(target)) {
			if (isString(name) && isNull(val)) return target[name] ? target[name] : target.getAttribute(name);
			if (isPlainObject(name)) {
				each(name, function(i, j) {
					attr(target, i, j, isSetValue)
				})
			} else {
				(isSetValue || !SE()) ? target[name] = execObject(val) : target.setAttribute(name, execObject(val))
			}
		}
	}
	function clone(o, isDeep) {
		if (isDom(o)) { return o.cloneNode(isDeep == !0) }
		var r = [];
		each(o, function(k, v) {
			isDom(v) && r.push(clone(v, isDeep))
		})
		return new Query(r)
	}
	var dn = "$Qmikdata:";
	function data(o, k, v) {
		if (likeArray(o)) {
			if (isString(k) && isNull(v)) return data(o[0], k, v);
			each(o, function(i, j) {
				data(j, k, v)
			})
		} else if (!isNull(o)) {
			if (isNull(o[dn])) o[dn] = {};
			if (isNull(v) && isString(k)) return o[dn][k];
			isString(k) ? o[dn][k] = v : each(k, function(i, j) {
				o[dn][i] = j
			});
		}
	}
	function queue(o, k, f) {
		if (isF(k)) {
			f = k;
			k = "fx"
		}
		k = "queue$" + (k || "fx");
		var s = data(o, k) || [];
		if (likeArray(f)) data(o, k, toV(f, F));
		else if (isF(f)) {
			s.push(f);
			data(o, k, s)
		}
		return isNull(f) ? likeArray(f) ? f : s : o
	}
	var rK = /[\S-_]+=/, rC = /[.][\S-_]+/;
	function getTagAttr(select) { // div[name=aa] get div name aa
		var s = select, tags = match.TAG.exec(s), tag = "", k, v, type = 1;
		if (tags) tag = tags[0];
		s = replace(replace(replace(s, tag, ""), /^\s*\[/, ""), /\]\s*$/, "");
		k = trim(rK.exec(s)[0]);
		if (k.match(/!\s*=$/)) type = 2;
		k = replace(k, /!?=$/, "");
		v = replace(replace(trim(replace(s, rK, "")), /"$/, ""), /^"/, "");
		v = v || "true";
		return [
			tag, k, v, type
		]
	}
	function getTagClass(select) { // div.cc get div cc
		var s = select, tags = match.TAG.exec(s), tag = "", cn;
		if (tags) tag = tags[0];
		s = replace(s, tag, "");
		cn = rC.exec(s);
		cn = cn ? replace(trim(cn[0]), /^\s*[.]/, "") : "";
		return [
			tag, cn
		]
	}
	function at(o, n) {
		return o[n] || o.getAttribute(n)
	}
	// selector 选择语句,parentList 父结果列表("div a.aa p" p的父结果列表就是 div a.aa)
	function compile(selector, parentList) { // 编译查询条件，返回[{type,query,isChild}...]
		var st, n, isChild = /^\s*>\s*/.test(selector);
		selector = replace(selector, /^\s*>?\s*/, "");
		parentList = parentList || [];
		for (st in match) {
			n = match[st].exec(selector);
			if (n) break
		}
		if (!n) return parentList;
		n = trim(n[0]);
		selector = replace(selector, n, "");
		parentList.push( {
			type : st,
			query : n,
			isChild : isChild
		});
		return compile(selector, parentList)
	}
	// 找compile()解析出的对象,判断当前的查找条件是否满足其对应的父查询条件 isCycle:是否遍历父节点,默认true
	function adapRule(dom, parentQuery, isCycle, context) {
		if (!isDom(dom)) return !1;
		context = context || doc;
		// isCycle = isNull(isCycle) ? !0 : isCycle;
		isCycle = isCycle != !1;
		var query = parentQuery.query, isGP = !parentQuery.isChild && (isCycle != !1), p = dom.parentNode;
		if (!isDom(p)) return !1;
		if (!Q.contains(context, dom)) return !1;
		switch (parentQuery.type) {
		case 'ID':
			return (at(p, "id") == trim(replace(query, /^#/, ""))) ? !0 : isGP ? adapRule(p, parentQuery, isCycle, context) : !1;
		case 'ATTR':
			var ds = getTagAttr(query), tag = ds[0], k = ds[1], v = ds[2];
			return (toLower(p.tagName) == tag && at(p, k) == v) ? !0 : isGP ? adapRule(p, parentQuery, isCycle, context) : !1;
		case 'CT':
			var ds = getTagClass(query), tag = ds[0], className = ds[1];
			if (tag) {
				return (toLower(p.tagName) == tag && hasClass(p, className)) ? !0 : isGP ? adapRule(p, parentQuery, isCycle, context) : !1
			} else {
				return hasClass(p, className) ? !0 : isGP ? adapRule(p, parentQuery, isCycle, context) : !1
			}
		case 'TAG':
			return (toLower(p.tagName) == query) ? !0 : isGP ? adapRule(p, parentQuery, isCycle, context) : !1;
		}
		return !1
	}
	// function find(s, c) {
	// if (s == "") return [];
	// return muchToArray(c.querySelectorAll(s))
	// }
	function GN(dom, type) {
		if (dom) {
			dom = type == "prev" ? dom.previousSibling : dom.nextSibling;
			return isDom(dom) ? dom : GN(dom, type)
		}
	}
	function upon(qmik, selector, type) {
		var r = [], f;
		each(qmik, function(i, v) {
			isNull(selector) ? r.push(GN(v, type)) : each(Q(">" + selector, v.parentNode), function(j, h) {
				if (!f) {
					for ( var z = v; z = GN(z);) {
						if (z == h) {
							r.push(h);
							f = !0;
							break
						}
					}
				}
			})
		})
		return new Query(r, qmik)
	}
	/**
	 * selector:选择器 qmik:qmik查询对象 isAllP:是否包含所有父及祖父节点 默认true
	 * isOnlyParent:是否只包含父节点 默认false
	 */
	function parents(selector, qmik, isAllP, isOnlyParent) {
		var array = [], qa = isString(selector) ? compile(selector) : null;
		isAllP = isAllP != !1;
		isOnlyParent = isOnlyParent == !0;
		each(qmik, function(i, v) {
			while (v) {
				if (v.parentNode == doc.body) break;
				if (isNull(qa) || adapRule(v, qa[0], false)) {
					array.push(v.parentNode);
					if (!isAllP) break
				}
				if (isOnlyParent) break;
				v = v.parentNode;
			}
		});
		return Q(array)
	}
	Q.init = init;
	Q.fn = Query.prototype;
	Q.fn.extend = function(o) {
		each(o, function(k, v) {
			Query.prototype[k] = v
		})
	}
	Q.fn.extend( {
		last : function() {
			return Q(this[this.length - 1])
		},
		eq : function(i) {
			return Q(this[i])
		},
		first : function() {
			return Q(this[0])
		},
		filter : function(f) {
			var r = new Query();
			each(this, function(i, v) {
				if (f(i, v)) r.push(v)
			});
			return r
		},
		even : function() {
			return this.filter(function(i, v) {
				return i % 2 == 0
			})
		},
		odd : function() {
			return this.filter(function(i, v) {
				return i % 2 != 0
			})
		},
		gt : function(i) {
			var r = new Query();
			each(this, function(i, v) {
				r.push(v)
			})
			return r
		},
		lt : function(i) {
			var r = new Query();
			for (; i >= 0; i--) {
				r.push(this[i])
			}
			return r
		},
		find : function(s) {
			return new Query(s, this)
		},
		each : function(f) {
			each(this, f);
			return this
		},
		append : function(c) {
			append(this, c);
			return this
		},
		remove : function() {
			each(this, function(i, v) {
				isDom(v.parentNode) && v.parentNode.removeChild(v)
			});
			return this
		},
		before : function(c) {
			before(this, c);
			return this
		},
		after : function(c) {
			after(this, c);
			return this
		},
		html : function(v) {
			if (arguments.length < 1) return attr(this, "innerHTML")
			else {
				attr(this, "innerHTML", isQmik(v) ? v.html() : v, !0)
			}
			return this
		},
		empty : function() {
			this.html("");
			return this
		},
		text : function(v) {
			var r = attr(this, "innerText", isQmik(v) ? v.text() : v, !0);
			return isNull(v) ? r : this
		},
		addClass : function(n) {
			each(this, function(i, v) {
				if (isDom(v) && !hasClass(v, n)) v.className += ' ' + trim(execObject(n))
			});
			return this
		},
		rmClass : function(n) {
			var r = new RegExp(replace(execObject(n), /\s+/g, "|"), 'g');
			each(this, function(i, v) {
				v.className = replace(trim(replace(v.className, r, '')), /[\s]+/g, ' ')
			});
			return this
		},
		show : function() {
			css(this, 'display', 'block');
			return this
		},
		hide : function() {
			css(this, 'display', 'none');
			return this
		},
		toggle : function() {
			each(this, function(i, v) {
				css(v, 'display') == 'none' ? $(v).show() : $(v).hide()
			});
			return this
		},
		map : function(callback) {
			return Q.map(this, callback)
		},
		css : function(k, v) {
			var r = css(this, k, v);
			return isPlainObject(k) || (isString(k) && !isNull(v)) ? this : r
		},
		attr : function(k, v) {
			var r = attr(this, k, v);
			return (arguments.length > 1 || isPlainObject(k)) ? this : r
		},
		rmAttr : function(k) {
			each(this, function(i, v) {
				isDom(v) && v.removeAttribute(k)
			})
		},
		data : function(k, v) {
			return data(this, k, v)
		},
		rmData : function(k) {
			each(this, function(i, v) {
				if (v.$Qmikdata) delete v.$Qmikdata[k]
			})
		},
		val : function(v) {
			if (isNull(v)) return this.attr("value") || "";
			each(this, function(i, u) {
				Q(u).attr("value", v)
			})
		},
		serialize : function() {
			var r = [];
			if (this) r = Q('input', this);
			else each(this, function(i, v) {
				if (isDom(v)) Q.merge(r, Q.serializeArray(Q('input', v)))
			});
			return Q.serialize(r)
		},
		next : function(s) {
			return upon(this, s, "next")
		},
		prev : function(s) {
			return upon(this, s, "prev")
		},
		queue : function(k, v) {
			return queue(this, k, v)
		},
		dequeue : function(k) {
			var a = queue(this, k);
			a[0] && a[0]();
			a.splice(0, 1);
			return this
		},
		clearQueue : function(k) {
			queue(this, k, []);
			return this
		},
		clone : function(t) {
			return clone(this, t)
		},
		hover : function(fin, fout) {
			this.bind("mouseover", fin).bind("mouseout", fout).bind("touchstart", function() {
				fin();
				Q.delay(fout, 500)
			})
		},
		hasClass : function(c) {
			return hasClass(this[0], c)
		},
		closest : function(selector) {// 查找最近的匹配的父(祖父)节点
			return parents(selector, this, false)
			/**
			 * selector:选择器 qmik:qmik查询对象 isAllP:是否包含所有父及祖父节点 默认true
			 * isOnlyParent:是否只包含父节点 默认false function parents(selector, qmik,
			 * isAllP, isOnlyParent)
			 */
		},
		parents : function(selector) {// 查找所有的匹配的父(祖父)节点
			return parents(selector, this, true)
		},
		parent : function(selector) {// 查找匹配的父节点
			return parents(selector, this, true, true)
		}
	});
	Q.fn.extend( {
		removeClass : Q.fn.rmClass,
		removeData : Q.fn.rmData,
		removeAttr : Q.fn.rmAttr
	});
	Q.isQmik = isQmik;
	/**
	 * event orientationchange:重力感应,0：与页面首次加载时的方向一致 -90：相对原始方向顺时针转了90° 180：转了180°
	 * 90：逆时针转了 Android2.1尚未支持重力感应
	 */
	var qwc = "orientationchange touchstart touchmove touchend focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error"
		.split(" ");
	each(qwc, function(i, v) {
		Q.fn[v] = function(f) {
			return this.bind(v, f)
		}
	})
})(Qmik);

/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {
	var checkTime = 30;// unit second
	// ///////////////////cache module
	function Cache() {
		var me = this;
		me._cache = {};
		Q.cycle(function() {
			me.iterator(function(key, value) {
				me.get(key)
			})
		}, checkTime)
	}
	Q.extend(Cache.prototype, {
		set : function(key, value, ttl) {
			ttl = isNum(ttl) ? ttl : -1;
			this._cache[key] = {
				value : value,
				ttl : (ttl < 0 ? -1 : ttl * 1000 + Q.time())
			}
		},
		get : function(key) {
			var ret = this._cache[key];
			if (ret && ret.ttl <= Q.time()) {
				delete this._cahce[key];
				ret = null
			}
			return ret ? ret.value : ret
		},
		rm : function(key) {
			delete this._cahce[key];
		},
		iterator : function(callback) {
			each(this._cache, function(key, value) {
				callback(key, value)
			})
		}
	});
	Q.Cache = Cache;
})(Qmik);

/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) { /* event */
	var win = Q.global, doc = win.document;
	var readyRE = /complete/, // /complete|loaded|interactive/
	ek = "$QmikEvents", liveFuns = {};
	var isNull = Q.isNull, isFun = Q.isFun, isDom = Q.isDom, each = Q.each;
	function SE() {
		return !isNull(doc.addEventListener)
	}
	Q.ready = Q.fn.ready = function(fun) {
		SE() ? Q(doc).bind('DOMContentLoaded', fun) : doc.onreadystatechange = function(e) {
			readyRE.test(doc.readyState) && fun(e)
		}
		return this
	}
	function Eadd(dom, name, fun, paramArray) {
		var t = Q(dom), d = t.data(ek) || {}, h = d[name];
		t.data(ek, d);
		if (!h) {
			d[name] = h = [];
			isFun(dom['on' + name]) ? (h[0] = dom['on' + name]) : SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
		}
		isFun(fun) && h.push( {
			fun : fun,
			param : paramArray || []
		})
	}
	function Erm(dom, name, fun) {
		var s = Q(dom).data(ek) || {}, h = s[name] || [], i = h.length - 1;
		if (fun) {
			for (; i >= 0; i--)
				h[i].fun == fun && h.splice(i, 1)
		} else {
			SE() ? dom.removeEventListener(name, handle, !1) : delete dom["on" + name];
			delete s[name]
		}
	}
	function Etrig(dom, name) {
		var e;
		if (SE()) {
			switch (name) {
			case "hashchange":
				e = doc.createEvent("HashChangeEvent");
				break
			default:
				e = doc.createEvent("MouseEvents");
			}
			e.initEvent(name, !0, !0);
			dom.dispatchEvent(e)
		} else dom.fireEvent('on' + name)
	}
	function handle(e) {
		e = e || fixEvent(win.event);
		var m = SE() ? this : (e.target || e.srcElement), fun, param, events = Q(m).data(ek) || {};
		each(events[e.type], function(i, v) {
			fun = v.fun;
			param = v.param || [];
			isFun(fun) && fun.apply(m, [
				e
			].concat(param))
		})
	}
	function fixEvent(e) {
		e.preventDefault = function() {
			this.returnValue = !0
		};
		e.stopPropagation = function() {
			this.cancelBubble = !0
		};
		return e
	}
	Q.fn.extend( {
		on : function(name, callback) {
			var p = Array.prototype.slice.call(arguments, 2);
			each(this, function(k, v) {
				Q.isPlainObject(name) ? each(name, function(k, j) {
					Eadd(v, k, j, callback)
				}) : Eadd(v, name, callback, p)
			});
			return this
		},
		un : function(name, callback) {
			each(this, function(k, v) {
				Erm(v, name, callback)
			});
			return this
		},
		once : function(name, callback) {// 只执行一次触发事件,执行后删除
			var me = this;
			function oneexec() {
				callback();
				me.un(name, oneexec)
			}
			me.on(name, oneexec)
		},
		trigger : function(name) {
			each(this, function(k, v) {
				Etrig(v, name)
			});
			return this
		},
		live : function(name, callback) {
			var fun = liveFuns[this.selector + ":live:" + callback.toString()] = function(e) {
				if (Q(e.target.childNodes[0]).closest(this.selector).length > 0) {
					callback.apply(event.target, [
						e
					]);
				}
			}
			Q("body").on(name, fun)
			return this
		},
		die : function(name, callback) {
			each(Q(document.body), function(k, v) {
				Erm(v, name, liveFuns[this.selector + ":live:" + (callback || "").toString()])
			});
			return this
		}
	});
	Q.fn.extend( {
		bind : Q.fn.on,
		unbind : Q.fn.un
	});
})(Qmik);

/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {// location位置+效果
	var win = Q.global, doc = win.document, isNull = Q.isNull, isDom = Q.isDom;
	// 计算元素的X(水平，左)位置
	function pageX(elem) {
		return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft
	}
	// 计算元素的Y(垂直，顶)位置
	function pageY(elem) {
		return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop
	}
	// 查找元素在其父元素中的水平位置
	function parentX(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode)
	}
	// 查找元素在其父元素中的垂直位置
	function parentY(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode)
	}
	Q.fn.extend( {
		width : function(v) {
			//var o = this[0];
			//return isNull(o) ? (v || 0) : isDom(o) ? o.offsetWidth : o == win ? win.screenX : win.screen.availWidth
			return this[0] ? this[0].offsetWidth : 0
		},
		height : function(v) {
			//var o = this[0];
			//return isNull(o) ? (v || 0) : isDom(o) ? o.offsetHeight : o == win ? win.screenY : win.screen.availHeight
			return this[0] ? this[0].o.offsetHeight : 0
		},
		offset : function() {// 获取匹配元素在当前视口的相对偏移
			if (!this[0]) return null;
			var obj = this[0].getBoundingClientRect();
			return {
				left : obj.left + win.pageXOffset,
				top : obj.top + win.pageYOffset
			};
		},
		position : function() {// 获取匹配元素相对父元素的偏移。
			var o = this[0];
			if (!o) return null;
			return {
				left : parentX(o),
				top : parentY(o)
			}
		},
		animate : function(styles, speed, easing, callback) {
			var m = this;
			Q.delay(function() {
				m.css(styles)
			}, speed || 500)
		}
	});
})(Qmik);

;
(function(Q) { /* ajax */
	var win = Q.global, toObject = Q.parseJSON, isFun = Q.isFun, ac = {
		type : 'GET',
		async : !0,
		// cache : !1,
		// session or local
		dataType : 'text',
		xhr : function() {
			try {
				return win.XMLHttpRequest && (win.location.protocol !== 'file:' || !win.ActiveXObject)	? new win.XMLHttpRequest()
																																	: new win.ActiveXObject('Microsoft.XMLHTTP')
			} catch (e) {
			}
		}
	};
	function ajax(conf) {
		var _config = Q.extend( {}, ac, conf), dataType = _config.dataType, ttl = _config.timeout, //
		xhr = ac.xhr(), data = _config.data, pid, success = _config.success, error = _config.error //
		;
		if (dataType == "jsonp") {
			ajax.callback = success
			Q.getScript(url)
		}
		_config.beforeSend && _config.beforeSend();
		xhr.onreadystatechange = function() {
			if (4 == xhr.readyState) {
				if (200 == xhr.status) {
					clearTimeout(pid);
					success && success(dataType == 'xml' ? xhr.responseXML
																	: (dataType == 'json' ? toObject(xhr.responseText) : xhr.responseText));
				} else {
					error && error(xhr.xhr, xhr.type)
				}
			}
		};
		xhr.open(_config.type, _config.url, _config.async);
		xhr.setRequestHeader("Cache-Control", "no-cache");
		xhr.send(_config.type == "GET" ? Q.param(data) : data);
		if (ttl > 0) pid = Q.delay(function() {
			xhr.abort();
			error && error(xhr.xhr, xhr.type)
		}, ttl)
	}
	function get(url, data, success, dataType, type) {
		ajax( {
			url : url,
			data : data,
			success : success,
			dataType : dataType,
			type : type
		})
	}
	Q.extend( {
		ajax : ajax,
		get : get,
		getJSON : function(url, success) {
			get(url, null, success, 'json')
		},
		post : function(url, data, callback, type) {
			if (isFun(data)) {
				type = callback;
				callback = data;
				data = null;
			}
			ajax( {
				url : url,
				data : data,
				success : callback,
				type : type
			})
		}
	})
})(Qmik);

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
		dependencies = dependencies.concat(parseDepents(factory));
		cacheModule[id] = new Module(id, Q.unique(dependencies), factory)
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
		var params = [];
		if (isArray(ids)) {
			var idx = 0;
			each(ids, function(i, id) {
				preload(function() {
					load(id, function(exports) {
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
		var idx = 0, dependencies = config.preload, length = dependencies.length;
		length == 0 ? callback() : each(dependencies, function(i, id) {
			idx++;
			cacheModule[id] || request(id2url(id), function() {
				useModule(cacheModule[id], require);
				idx == length && callback()
			})
		})
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
		module.isReady != !0 && module.factory(require, module.exports, module);
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
					});
					module.exports = win[id]
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
