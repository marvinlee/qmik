/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.37
 */
(function(Q) {
	var win = Q.global,
		doc = win.document;
	var isNull = Q.isNull,
		isDom = Q.isDom,
		E = Q.each,
		D = Q.isElement,
		likeArray = Q.likeArray,
		isArray = Q.isArray,
		isString = Q.isString,
		isFun = Q.isFun,
		isPlainObject = Q.isPlainObject,
		trim = Q.trim,
		toLower = Q.toLower,
		toUpper = Q.toUpper;
	var readyRE = /complete|loaded|interactive/,
		rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/,
		match = {
			ID: /^#[\w-_\u00c0-\uFFFF]+/,
			ATTR: /^([\w-_]+)\[\s*[\w-_]+\s*!?=\s*('|")?(.*)('|")?\s*\]/,
			CT: /^([\w-_]+)?\.[\w-_]+/,
			TAG: /^[\w-_]+/
		};
	function Query(selector, context) {
		var m = this, r;
		context = context || doc;
		m.selector = selector;
		m.context = context;
		if (isString(selector)) {
			if (rNode.test(selector)) {
				var t = doc.createElement('div');
				t.innerHTML = selector;
				r = t.childNodes
			} else {
				r = find(selector, context)
			}
		} else {
			r = likeArray(selector) ? selector : [
				selector
			]
		}
		r = r || [];
		for ( var i = 0; i < r.length; i++)
			m.push(r[i]);
		return m
	}
	Q.inherit(Query, Array);
	function init(selector, context) {
		context = context || doc;
		selector = isString(selector) ? trim(selector) : selector;
		if (isFun(selector)) { return Q(doc).ready(selector) }
		return isQmik(selector) ? selector : new Query(selector, context)
	}
	function isQmik(v) {
		return v instanceof Query
	}
	function find(selector, context, childs) {
		var nselector = trim(selector), r = [], context = context || doc;
		if (isQmik(context)) {
			E(context, function(i, v) {
				if (isDom(v)) r = r.concat(find(selector, v))
			});
			return r
		}
		childs = childs || compile(nselector);// 编译查询条件，返回[{type,query,isChild}...]
		if (!childs || childs.length < 1) return;
		r = findHandle(context, childs[0]);
		if (r == null || childs.length < 2) return r;
		nselector = childs[1].query;
		if (nselector != '') {
			var rs = [];
			childs.shift();
			E(r, function(k, x) {
				E(find(nselector, x, childs), function(o, p) {
					Q.inArray(p, rs) < 0 && rs.push(p)
				})
			});
			r = rs
		}
		return r
	}
	function execObject(v, target) {
		return isFun(v) ? (target ? v.call(target, v) : v()) : v
	}
	// As much as possible to Array
	function muchToArray(a) {
		// return !SE() ? a.slice(0, a.length) : a
		return a;
	}
	// 具体的实现查找
	function findHandle(context, qa) {
		var q = qa.query, r;
		if (qa.isChild) {
			var cs = muchToArray(context.childNodes);
			r = [];
			for ( var i = 0, t; i < cs.length; i++) {
				t = cs[i];
				if (isDom(t)) {
					switch (qa.type) {
					case 'ID':
						if (at(t, "id") == q) r.push(t);
						break;
					case 'ATTR':
						var ds = TKV(q), tn = ds[0], k = ds[1], v = ds[2], type = ds[3], bi;
						if (type == 1) bi = at(t, k) == v;
						else bi = at(t, k) != v;
						if (t.tagName == toUpper(tn) && bi) r.push(t);
						break;
					case 'CT':
						var ds = TC(q), tn = ds[0], cn = ds[1];
						if (tn) (t.tagName == toUpper(tn) && HC(t, cn)) && r.push(t);
						else HC(t, cn) && r.push(t);
						break;
					case 'TAG':
						t.tagName == toUpper(q) && r.push(t);
						break;
					}
				}
			}
		} else {
			switch (qa.type) {
			case 'ID':
				r = byId(context, q);
				break;
			case 'ATTR':
				r = byAttr(context, q);
				break;
			case 'CT':
				var sq = TC(q), t = sq[0] || "", cn = sq[1];
				r = SE() ? function() {
					var a = muchToArray(context.getElementsByClassName(cn) || []), g = toUpper(t);
					if (t == "") return a;
					return function(a) {
						for ( var i = a.length - 1; i >= 0; i--) {
							if (a[i].tagName != g) a.splice(i, 1)
						}
						;
						return a
					}(a);
				}() : byAttr(context, t + "[class=" + cn + "]");
				break;
			case 'TAG':
				r = muchToArray(context.getElementsByTagName(q));
				break;
			}
		}
		return r
	}
	function at(target, name) {
		return target[name] || target.getAttribute(name)
	}
	function fa(array, name, value, notEqual) {
		var exist, attribute, ret = [], isClass = name == "class";
		E(array, function(i, n) {
			if (isDom(n)) {
				attribute = at(n, name);
				attribute = attribute ? attribute : (isClass ? n.className : attribute);
				exist = isClass ? new RegExp(value.replace(/[ ]/g, "|")).test(attribute) : attribute == value;
				notEqual ? exist && ret.push(n) : !exist && ret.push(n);
			}
		});
		return ret
	}
	function byId(o, s) {
		s = s.replace(/^#/, "");
		var t, r = doc.getElementById(s);
		t = [
			r
		];
		return isNull(r) ? [] : o == doc ? t : byAttr(o, "[id=\"" + s + "\"]")
	}
	function byAttr(o, s) {
		o = o || doc;
		var st = TKV(s), t = st[0], k = st[1], v = st[2], y = s.indexOf('!=') == -1;
		return fa(muchToArray(o.getElementsByTagName(t || "*")), k, v, y);
	}
	// /////////////////////////////////////////////////
	function HC(o, cn) {
		if (!D(o)) return !1;
		var cs = o.className.split(" ") || [], cn = trim(cn);
		for ( var i = 0; i < cs.length; i++)
			if (cs[i] == cn) return !0;
		return !1
	}
	function FM(v) {
		return v.replace(/[A-Z]/g, function(v) {
			return "-" + v.toLowerCase()
		})
	}
	function SE() {
		return !isNull(doc.addEventListener)
	}
	function VC(c) {
		c = execObject(c);
		return isString(c) && rNode.test(c) ? Q(c) : c
	}
	function append(o, c) {
		c = VC(c);
		if (likeArray(o)) {
			E(o, function(k, v) {
				append(v, c)
			});
		} else if (D(o)) {
			if (likeArray(c)) {
				E(c, function(k, v) {
					append(o, v)
				});
			} else {
				o.appendChild(D(c) ? c : doc.createTextNode(c))
			}
		}
	}
	function before(o, c) {
		c = VC(c);
		if (likeArray(o)) E(o, function(k, v) {
			before(v, c)
		});
		else if (D(o)) {
			if (likeArray(c)) E(c, function(k, v) {
				before(o, v)
			});
			else {
				o.parentNode.insertBefore(D(c) ? c : doc.createTextNode(c), o)
			}
		}
	}
	function after(o, c) {
		if (D(o)) {
			var n = GN(o);
			n ? before(n, c) : append(o.parentNode, c)
		} else if (likeArray(o)) E(o, function(i, v) {
			after(v, c)
		})
	}
	function css(o, k, v) {
		k = isString(k) && !isNull(v) ? toO('{"' + k + '":"' + execObject(v) + '"}') : k;
		if (likeArray(o)) {
			if (isString(k)) return css(o[0], k);
			E(o, function(i, j) {
				css(j, k)
			})
		} else if (D(o)) {
			if (isString(k)) return o.style[FM(k)];
			v = "";
			E(k, function(i, j) {
				v += FM(i) + ':' + j + ';'
			});
			o.style.cssText += ';' + v
		}
	}
	function attr(target, name, val, isSetValue) {
		if (likeArray(target)) {
			if (isString(name) && isNull(val)) return attr(target[0], name, val, isSetValue);
			E(target, function(i, j) {
				attr(j, name, val, isSetValue)
			})
		} else if (!isNull(target)) {
			if (isString(name) && isNull(val)) return target[name] ? target[name] : target.getAttribute(name);
			if (isPlainObject(name)) E(name, function(i, j) {
				attr(target, i, j, isSetValue)
			});
			else {
				(isSetValue || !SE()) ? target[name] = execObject(val) : target.setAttribute(name, execObject(val))
			}
		}
	}
	function clone(o, t) {
		if (D(o)) { return o.cloneNode(t == !0) }
		var r = new o.constructor(o.valueOf());
		E(o, function(k, v) {
			r[k] = r[k] != v && Q.isObject(v) ? clone(v, t) : v
		})
		return r
	}
	function ready(fun) {
		function f() {
			fun(Q)
		}
		if (readyRE.test(doc.readyState)) f();
		else if (SE()) Q(doc).bind('DOMContentLoaded', f);
		else {
			Q(doc).bind("readystatechange", f)
		}
	}
	var dn = "$Qmikdata:";
	function data(o, k, v) {
		if (likeArray(o)) {
			if (isString(k) && isNull(v)) return data(o[0], k, v);
			E(o, function(i, j) {
				data(j, k, v)
			})
		} else if (!isNull(o)) {
			if (isNull(o[dn])) o[dn] = {};
			if (isNull(v) && isString(k)) return o[dn][k];
			isString(k) ? o[dn][k] = v : E(k, function(i, j) {
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
		if (isArray(f)) data(o, k, toV(f, F));
		else if (isF(f)) {
			s.push(f);
			data(o, k, s)
		}
		return isNull(f) ? isArray(f) ? f : s : o
	}
	var rK = /[\S-_]+=/, rC = /[.][\S-_]+/;
	function TKV(select) { // div[name=aa] get div name aa
		var s = select, tags = match.TAG.exec(s), tag = "", k, v, type = 1;
		if (tags) tag = tags[0];
		s = s.replace(tag, "").replace(/^\s*\[/, "").replace(/\]\s*$/, "");
		k = trim(rK.exec(s)[0]);
		if (k.match(/!\s*=$/)) type = 2;
		k = k.replace(/!?=$/, "");
		v = trim(s.replace(rK, "")).replace(/"$/, "").replace(/^"/, "");
		v = v || "true";
		return [
			tag, k, v, type
		]
	}
	function TC(select) { // div.cc get div cc
		var s = select, tags = match.TAG.exec(s), tag = "", cn;
		if (tags) tag = tags[0];
		s = s.replace(tag, "");
		cn = rC.exec(s);
		cn = cn ? trim(cn[0]).replace(/^\s*[.]/, "") : "";
		return [
			tag, cn
		]
	}
	function at(o, n) {
		return o[n] || o.getAttribute(n)
	}
	function compile(s, qa) { // 编译查询条件，返回[{type,query,isChild}...]
		var st, n, isChild = /^\s*>\s*/.test(s);
		s = s.replace(/^\s*>?\s*/, "");
		qa = qa || [];
		for (st in match) {
			n = match[st].exec(s);
			if (n) break
		}
		if (!n) return qa;
		n = trim(n[0]);
		s = s.replace(n, "");
		qa.push( {
			type : st,
			query : n,
			isChild : isChild
		});
		return compile(s, qa)
	}
	// 找compile()解析出的对象,判断当前的查找条件是否满足其对应的父查询条件 isCycle:是否遍历父节点,默认true
	function adapRule(o, qa, isCycle, c) {
		if (!D(o)) return !1;
		c = c || doc;
		isCycle = isNull(isCycle) ? !0 : isCycle;
		var s = qa.query, isGP = !qa.isChild && (isCycle != !1), p = o.parentNode;
		if (!D(p)) return !1;
		if (!NGP(c, o)) return !1;
		switch (qa.type) {
		case 'ID':
			return (at(p, "id") == trim(s.replace(/^#/, ""))) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
		case 'ATTR':
			var ds = TKV(s), tag = ds[0], k = ds[1], v = ds[2];
			return (toLower(p.tagName) == tag && at(p, k) == v) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
		case 'CT':
			var ds = TC(s), tag = ds[0], className = ds[1];
			if (tag) {
				return (toLower(p.tagName) == tag && HC(p, className)) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1
			} else {
				return HC(p, className) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1
			}
		case 'TAG':
			return (toLower(p.tagName) == s) ? !0 : isGP ? adapRule(p, qa, isCycle, c) : !1;
		}
		return !1
	}
	// function find(s, c) {
	// if (s == "") return [];
	// return muchToArray(c.querySelectorAll(s))
	// }
	function GN(v, t) {
		if (v) {
			v = t == "prev" ? v.previousSibling : v.nextSibling;
			return D(v) ? v : GN(v, t)
		}
	}
	function upon(m, s, t) {
		var r = [], f;
		E(m, function(i, v) {
			isNull(s) ? r.push(GN(v, t)) : E(Q(">" + s, v.parentNode), function(j, h) {
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
		return new Query(r, m)
	}
	/**
	 * selector:选择器 qmik:qmik查询对象 isAllP:是否包含所有父及祖父节点 默认true
	 * isOnlyParent:是否只包含父节点 默认false
	 */
	function parents(selector, qmik, isAllP, isOnlyParent) {
		var i = 0, m = qmik, array = [], p, qa = isString(selector) ? compile(selector) : null;
		isAllP = isNull(isAllP) ? !0 : (isAllP != !1);
		isOnlyParent = isNull(isOnlyParent) ? !1 : (isOnlyParent == !0);
		for (; i < m.length; i++) {
			p = m[i];
			while (p) {
				if (p.parentNode == doc.body) break;
				if (isNull(qa) || adapRule(p, qa[0], false)) {
					array.push(p.parentNode);
					if (!isAllP) break
				}
				if (isOnlyParent) break;
				p = p.parentNode;
			}
		}
		return Q(array)
	}
	Q.init = init;
	Q.fn = Query.prototype;
	Q.fn.extend = function(o) {
		E(o, function(k, v) {
			Query.prototype[k] = v
		});
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
			var r = new Query(), c = 0;
			E(this, function(i, v) {
				if (f(i, v)) r[c++] = v
			});
			r.length = c;
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
			var r = new Query(), c = 0;
			for (; i < this.length; i++) {
				r[c++] = this[i]
			}
			;
			r.length = c;
			return r
		},
		lt : function(i) {
			var r = new Query(), c = 0;
			for (; i >= 0; i--) {
				r[c++] = this[i]
			}
			;
			r.length = c;
			return r
		},
		find : function(s) {
			return new Query(s, this)
		},
		each : function(f) {
			E(this, f)
		},
		append : function(c) {
			append(this, c);
			return this
		},
		remove : function() {
			E(this, function(i, v) {
				var p = v.parentNode;
				D(p) && p.removeChild(v)
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
			if (arguments.length < 1) return attr(this, "innerHTML");
			else attr(this, "innerHTML", isQmik(v) ? v.html() : v, !0);
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
			E(this, function(i, v) {
				if (D(v) && !HC(v, n)) v.className += ' ' + trim(execObject(n))
			});
			return this
		},
		rmClass : function(n) {
			var r = new RegExp(execObject(n).replace(/\s+/g, "|"), 'g');
			E(this, function(i, v) {
				v.className = trim(v.className.replace(r, '')).replace(/[\s]+/g, ' ')
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
			E(this, function(i, v) {
				css(v, 'display') == 'none' ? $(v).show() : $(v).hide()
			});
			return this
		},
		map : function(callback) {
			return Q.map(this, callback)
		},
		ready : function(fun) {
			ready(fun);
			return this
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
			E(this, function(i, v) {
				D(v) && v.removeAttribute(k)
			})
		},
		data : function(k, v) {
			return data(this, k, v)
		},
		rmData : function(k) {
			E(this, function(i, v) {
				if (v.$Qmikdata) delete v.$Qmikdata[k]
			})
		},
		val : function(v) {
			if (isNull(v)) return this.attr("value") || "";
			E(this, function(i, u) {
				Q(u).attr("value", v)
			})
		},
		serialize : function() {
			var r = [];
			if (this) r = Q('input', this);
			else E(this, function(i, v) {
				if (D(v)) Q.merge(r, Q.serializeArray(Q('input', v)))
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
		hover : function(fi, fo) {
			this.bind("mouseover", fi).bind("mouseout", fo).bind("touchstart", function() {
				fi();
				Q.delay(fo, 500)
			}).bind("touchmove", fo)
		},
		hasClass : function(c) {
			return HC(this[0], c)
		},
		closest : function(s) {// 查找最近的匹配的父(祖父)节点
			return parents(s, this, false)
		},
		parents : function(s) {// 查找所有的匹配的父(祖父)节点
			return parents(s, this, true)
		},
		parent : function(s) {// 查找匹配的父节点
			return parents(s, this, true, true)
		}
	});
	Q.fn.extend( {
		removeClass : Q.fn.rmClass,
		removeData : Q.fn.rmData,
		removeAttr : Q.fn.rmAttr,
		toArray : Q.fn.array
	});
	//event
	var qwc = "touchstart touchmove touchend focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error"
		.split(" ");
	E(qwc, function(i, v) {
		Q.fn[v] = function(f) {
			return this.bind(v, f)
		}
	});
})(Qmik);