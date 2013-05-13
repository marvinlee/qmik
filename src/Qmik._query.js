/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.37
 */
(function(Q) {
	var win = Q.global, doc = win.document, protoArray = Array.prototype;
	var isNull = Q.isNull, isDom = Q.isDom, each = Q.each, likeArray = Q.likeArray, isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun, isPlainObject = Q.isPlainObject, trim = Q.trim, replace = function(value, str1, str2) {
		return value.replace(str1, str2)
	}, toJSON = Q.toJSON, toLower = Q.toLower, toUpper = Q.toUpper;
	var rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/, match = {
		ID : /^#[\w-_\u00c0-\uFFFF]+/,
		ATTR : /^([\w-_]+)\[\s*[\w-_]+\s*!?=\s*('|")?(.*)('|")?\s*\]/,
		CT : /^([\w-_]+)?\.[\w-_]+/,
		TAG : /^[\w-_]+/
	};
	function Query(selector, context) {
		var me = this, r;
		me.context = context = context || doc;
		me.selector = selector;
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
			]
		}
		r = r || [];
		each(r, function(k, v) {
			v && me.push(v)
		})
		return me
	}
	Q.inherit(Query, Array);
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
	// As much as possible to Array
	function muchToArray(a) {
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
		// var st = getTagAttr(selector), tag = st[0], attrName = st[1], attrValue
		// = st[2], isEqual = selector.indexOf('!=') == -1;
		// return findMath(muchToArray(dom.getElementsByTagName(tag || "*")),
		// attrName, attrValue, isEqual)
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
		if (isArray(o)) {
			each(o, function(k, v) {
				append(v, child)
			})
		} else if (isDom(o)) {
			isArray(child) ? each(child, function(k, v) {
				append(o, v)
			}) : o.appendChild(isDom(child) ? child : doc.createTextNode(child))
		}
	}
	function before(o, child) {
		child = muchValue2Qmik(child);
		if (isArray(o)) {
			each(o, function(k, v) {
				before(v, child)
			})
		} else if (isDom(o)) {
			isArray(child) ? each(child, function(k, v) {
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
		if (isArray(o)) {
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
		if (isArray(target)) {
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
		if (isArray(f)) data(o, k, toV(f, F));
		else if (isF(f)) {
			s.push(f);
			data(o, k, s)
		}
		return isNull(f) ? isArray(f) ? f : s : o
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
				var p = v.parentNode;
				isDom(p) && p.removeChild(v)
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
			else {
				each(Q(this), function(i, node) {
					Q(node).remove()
				});
				attr(this, "innerHTML", isQmik(v) ? v.html() : v, !0);
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
	// event
	var qwc = "touchstart touchmove touchend focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout change select keydown keypress keyup error"
		.split(" ");
	each(qwc, function(i, v) {
		Q.fn[v] = function(f) {
			return this.bind(v, f)
		}
	})
})(Qmik);
