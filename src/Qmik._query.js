/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.100
 */
(function(Q) {
	var win = Q.global,
		doc = win.document,
		_in = Q._in;
	var SE = _in.isSE,
		isNull = Q.isNull,
		isDom = Q.isDom,
		each = Q.each, //
		likeArray = Q.likeArray,
		isArray = Q.isArray,
		likeNull = Q.likeNull, //
		isString = Q.isString,
		isFun = Q.isFun,
		isPlainObject = Q.isPlainObject,
		trim = Q.trim, //
		toLower = Q.toLower,
		toUpper = Q.toUpper,
		replace = function(value, str1, str2) {
			return value.replace(str1, str2)
		};
	/* 节点查询编译 */
	var rNode = /^\s*(<.+>.*<\/.+>)+|(<.+\/\s*>)+\s*$/,
		addUints = "height width top right bottom left".split(" ");
	/** Qmik查询 */
	function Query(selector, context) {
		var me = this,
			r;
		me.context = context = context || doc;
		//me.selector = selector = render(selector, context);
		me.selector = selector;
		me.length = 0;
		me.__lives = {};
		if (isString(selector)) {
			if (rNode.test(selector.replace(/\n+/g, ""))) {
				var t = doc.createElement('div');
				t.innerHTML = selector;
				r = t.children;
                compileScript(t);
			} else {
				each(find(selector, context), function(j, dom) {
					me._push(dom)
				})
				return me
			}
		} else {
			r = likeArray(selector) ? selector : [
				selector
			]
		}
		for (var i = 0; i < r.length; i++) {
			me._push(r[i])
		}
		return me
	}
	Q.extend(Query.prototype, {
		_push: function(v) {
			v && (this[this.length++] = v)
		}
	});
	// Q.inherit(Query, Array);
	function init(selector, context) {
		context = context || doc;
		if (isFun(selector)) {
			return Q(doc).ready(selector)
		}
		return isQmik(selector) ? selector : new Query(selector, context)
	}

	function isQmik(v) {
			return v instanceof Query
		}
		//查找元素节点
	function find(selector, context) {
		var result = [];
		if (!likeNull(selector)) {
			context = isString(context) ? Q(context) : context;
			if (isQmik(context)) {
				each(context, function(i, v) {
					isDom(v) && (result = arrayConcat(result, v.querySelectorAll(selector)))
				});
			} else {
				result = context.querySelectorAll(selector) || []
			}
		}
		return result
	}

	function muchValue2Qmik(c) {
		c = execObject(c);
		return isString(c) && rNode.test(c.replace(/\n+/g, "")) ? Q(c) : c
	}

	function execObject(v) {
		//return isFun(v) ? v() : render(v)
		return isFun(v) ? v() : v
	}

	/*function render(val, context) {
		return (Q.isPlainObject(val) && (isString(val.tag) || isString(val.text))) ? Q.render(val, context || {}) : val
	}*/
		// As much as possible to Array
	function arrayConcat(sarray, tarray) {
		if (isArray(tarray)) {
			sarray = sarray.concat(tarray)
		} else {
			for (var i = 0; i < tarray.length; i++) {
				sarray.push(tarray[i])
			}
		}
		return sarray
	}

	function at(target, name) {
		return !SE() ? target[name] : target.getAttribute(name) || target[name]
	}

	// /////////////////////////////////////////////////
	function hasClass(dom, className) {
		if (!isDom(dom)) return !1;
		var cs = dom.className.split(" "),
			i = 0;
		className = trim(className);
		for (; i < cs.length; i++)
			if (cs[i] == className) return !0;
		return !1
	}

	function formateClassName(v) {
		return replace(v, /[A-Z]/g, function(v) {
			return "-" + toLower(v)
		})
	}

	function createTextNode(val) {
		return doc.createTextNode(val)
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
			}) : o.appendChild(isDom(child) ? child : createTextNode(child))
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
			}) : o.parentNode.insertBefore(isDom(child) ? child : createTextNode(child), o)
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

	function setValue(obj, key, val) {
		obj[key] = val;
		return obj
	}

	function formateClassNameValue(name, value) {
		for (var i in addUints) {
			if (name.indexOf(addUints[i]) >= 0) {
				if (!/[^\d\.-]/.test(value)) {
					value += "px"
				}
				break
			}
		}
		return value
	}

	function getStyle(dom, name) {
		return dom.currentStyle ? dom.currentStyle[name] : doc.defaultView.getComputedStyle(dom, false)[name]
	}

	function css(o, k, v) {
		//k = isString(k) && !isNull(v) ? Q.parseJSON('{"' + k + '":"' + execObject(v) + '"}') : k;
		k = isString(k) && !isNull(v) ? setValue({}, k, execObject(v)) : k;
		if (likeArray(o)) {
			if (isString(k)) return css(o[0], k);
			each(o, function(i, j) {
				css(j, k)
			})
		} else if (isDom(o)) {
			//if (isString(k)) return o.style[formateClassName(k)];
			if (isString(k)) return getStyle(o, formateClassName(k));
			v = "";
			each(k, function(i, j) {
				v += formateClassName(i) + ':' + formateClassNameValue(i, j) + ';'
			});
			o.style.cssText += ';' + v
		}
	}

	function attr(target, name, val, isSetValue) {
		if (likeArray(target)) {
			if (isString(name) && isNull(val)) return attr(target[0], name, val, isSetValue) || "";
			each(target, function(i, j) {
				attr(j, name, val, isSetValue)
			})
		} else if (!isNull(target)) {
			//if (isString(name) && isNull(val)) return target[name] ? target[name] : target.getAttribute(name);
			//if (isString(name) && isNull(val)) return (isSetValue || !SE()) ? target[name] : target.getAttribute(name) || target[name];
			if (isString(name) && isNull(val)) return at(target, name);
			if (isPlainObject(name)) {
				each(name, function(i, j) {
					attr(target, i, j, isSetValue)
				})
			} else {
				if (isDom(val)) {
					attr(target, name, "", isSetValue);
					Q(target).append(val)
				} else {
					var val = execObject(val);
					(isSetValue || !SE()) ? target[name] = val: target.setAttribute(name, val);
				}
			}
		}
	}

	function clone(o, isDeep) {
		if (isDom(o)) {
			return Q(o.cloneNode(isDeep == !0))
		}
		var r = [];
		each(o, function(k, v) {
			isDom(v) && r.push(clone(v, isDeep))
		})
		return Q(r)
	}
	var dn = "Qmikdata:";

	function data(o, k, v) {
		if (likeArray(o)) {
			if (isString(k) && isNull(v)) return data(o[0], k, v);
			each(o, function(i, j) {
				data(j, k, v)
			});
			return o;
		} else if (!isNull(o)) {
			if (isNull(o[dn])) o[dn] = {};
			if (isNull(v) && isString(k)) return o[dn][k];
			isString(k) ? o[dn][k] = v : each(k, function(i, j) {
				o[dn][i] = j
			})
		}
	}

	function GN(dom, type) {
		if (dom) {
			dom = type == "prev" ? dom.previousSibling : dom.nextSibling;
			return isDom(dom) ? dom : GN(dom, type)
		}
	}

	function uponSelector(dom, selector, type, ret) {
		var list = Q(dom.parentNode).children(selector),
			i, zdom;
		if (type == "prev") {
			for (i = list.length - 1; i >= 0; i--) {
				for (zdom = dom;
					(zdom = GN(zdom, type)) && zdom == list[i];) {
					ret.push(zdom);
					break
				}
			}
		} else {
			for (i = 0; i < list.length; i++) {
				for (zdom = dom;
					(zdom = GN(zdom, type)) && zdom == list[i];) {
					ret.push(zdom);
					break
				}
			}
		}
	}

	function upon(qmik, selector, type) {
		var ret = [];
		each(qmik, function(i, dom) {
			isNull(selector) ? ret.push(GN(dom, type)) : uponSelector(dom, selector, type, ret)
		});
		return new Query(ret, qmik)
	}

	function matchesSelector(dom, selector) {
			if (dom) {
				dom._matchesSelector = dom.matchesSelector || dom.msMatchesSelector || dom.mozMatchesSelector || dom.webkitMatchesSelector;
				return dom._matchesSelector && dom._matchesSelector(selector)
			}
		}
		/**
		 * 	selector:选择器 
		 	qmik:qmik查询对象 
		 	isAllP:是否包含所有父及祖父节点 默认true
		 * 	isOnlyParent:往上查找的层级是否只到直接父节点 默认false
		 */
	function parents(selector, qmik, isAllP, isOnlyParent) {
		selector = selector ? trim(selector) : selector;
		var array = [],
			isPush = 0;
		isAllP = isAllP != !1;
		isOnlyParent = isOnlyParent == !0;
		var isSelector = !isNull(selector);
		each(qmik, function(i, dom) {
			var p = dom.parentNode,
				tp;
			while (isDom(p)) {
				isPush = 0;
				if (isSelector) {
					tp = p.parentNode;
					if (tp && Q.inArray(p, Q(tp).children(selector)) > -1) {
						isPush = 1
					}
				} else {
					isPush = 1
				}
				if (isPush) {
					array.push(p);
					if (!isAllP) break
				}
				if (isOnlyParent) break;
				p && (p = p.parentNode)
			}
		});
		return Q(array)
	}

    function compileScript(context){
        Q("script", context).each(function(i, dom) {
            Q.execCatch(function(){eval(dom.text||"")});
        });
    }

	/* */
	//高度
	function getHeight() {
		return win.innerHeight || screen.availHeight;
	}
    function getMaxX() {
        return win.pageXOffset + win.innerWidth + 120;
    }
	function getMaxY() {
		return win.pageYOffset + getHeight() + 120;
	}	
	/**/

	Q.init = init;
	var fn = Q.fn = Query.prototype;
	fn.extend = function(o) {
		each(o, function(k, v) {
			Query.prototype[k] = v
		})
	}
	fn.extend({
		last: function() {
			return Q(this[this.length - 1])
		},
		eq: function(i) {
			return Q(this[i])
		},
		first: function() {
			return Q(this[0])
		},
		filter: function(f) {
			var r = new Query();
			each(this, function(i, v) {
				if (f(i, v)) r._push(v)
			});
			return r
		},
		even: function() {
			return this.filter(function(i, v) {
				return i % 2 == 0
			})
		},
		odd: function() {
			return this.filter(function(i, v) {
				return i % 2 != 0
			})
		},
		gt: function(i) { // 大于
			var r = new Query(),
				j = i + 1;
			for (; j < this.length && j >= 0; j++) {
				r._push(this[j])
			}
			return r
		},
		lt: function(i) { // 小于
			var r = new Query(),
				j = 0;
			for (; j < i && j < this.length; j++) {
				r._push(this[j])
			}
			return r
		},
		find: function(s) {
			return new Query(s, this)
		},
		each: function(f) {
			each(this, f);
			return this
		},
		append: function(c) {
			append(this, c);
			return this
		},
		appendTo: function(c) {
			Q(c).append(this);
			return this;
		},
		remove: function() {
			each(this, function(i, v) {
				isDom(v.parentNode) && v.parentNode.removeChild(v)
			});
			return this
		},
		before: function(c) {
			before(this, c);
			return this
		},
		after: function(c) {
			after(this, c);
			return this
		},
		beforeTo: function(c) {
			before(c, this);
			return this
		},
		afterTo: function(c) {
			after(c, this);
			return this
		},
		html: function(v) {
			var me = this;
			if (arguments.length < 1) return attr(me, "innerHTML");
			else {
				attr(me, "innerHTML", isQmik(v) ? v.html() : v, !0);
                compileScript(me);
			}
			return this
		},
		empty: function() {
			return this.html("")
		},
		text: function(v) {
			var r = attr(this, "innerText", isQmik(v) ? v.text() : v, !0);
			return isNull(v) ? r : this
		},
		addClass: function(n) {
			each(this, function(i, v) {
				if (isDom(v) && !hasClass(v, n)) v.className += ' ' + trim(execObject(n))
			});
			return this
		},
		rmClass: function(n) {
			var r = new RegExp(replace(execObject(n), /\s+/g, "|"), 'g');
			each(this, function(i, v) {
				v.className = replace(trim(replace(v.className, r, '')), /[\s]+/g, ' ')
			});
			return this
		},
		show: function() {
			css(this, 'display', 'block');
			return this
		},
		hide: function() {
			css(this, 'display', 'none');
			return this
		},
		inViewport: function(){
			var qdom = this,
				offset = qdom.offset(),
				bool = false;
			if (offset) {
				var elTop = offset.top,
                    elLeft = offset.left,
					elDown = elTop + qdom.height(),
                    elRight = elLeft + qdom.width(),
                    minX = win.pageXOffset,
                    maxX = getMaxX(),
					minY = win.pageYOffset,
					maxY = getMaxY();
                minY = minY < 0 ? 0 : minY;
				//return elTop >= 0 && elTop >= min && elTop <= max;
				bool = elTop <= maxY && elDown >= minY;
                bool = bool && elLeft <= maxX && elRight >= minX
			}
			return bool;
		},
        /**
         *
         * @param style
         * @param time
         * @param easing  可以的值,默认 ease-in-out
                     linear	规定以相同速度开始至结束的过渡效果（等于 cubic-bezier(0,0,1,1)）。
                     ease	规定慢速开始，然后变快，然后慢速结束的过渡效果（cubic-bezier(0.25,0.1,0.25,1)）。
                     ease-in	规定以慢速开始的过渡效果（等于 cubic-bezier(0.42,0,1,1)）。
                     ease-out	规定以慢速结束的过渡效果（等于 cubic-bezier(0,0,0.58,1)）。
                     ease-in-out	规定以慢速开始和结束的过渡效果（等于 cubic-bezier(0.42,0,0.58,1)）。
                     cubic-bezier(n,n,n,n)	在 cubic-bezier 函数中定义自己的值。可能的值是 0 至 1 之间的数值。

         * @param callback
         * @returns {*}
         */
		animate: function(style, time, easing, callback){
			var me = this;
            if(isFun(easing)){
                callback = easing;
                easing = " ";
            }
			var initStyle = {transition: 0}, startStype = Q.extend({}, initStyle);
			each(style, function(key, val){
				startStype[key] = parseFloat(css(me, key))||0;
			});
			css(me, startStype);
			Q.delay(function(){
                var isNotEnd = true;
				style.transition = (easing||" ease-in-out ") +" " + (time || 1) + "ms";
				css(me, Q.cssPrefix(style));
				function transitionEnd(e) {
                    if(isNotEnd){
                        css(me, initStyle);
                        callback && callback(e);
                        isNotEnd = false;
                    }
				}
				me.once({
					webkitTransitionEnd: transitionEnd,
					msTransitionEnd: transitionEnd,
					oTransitionEnd: transitionEnd,
					transitionend: transitionEnd
				});
			}, 10);
			return me;
		},
		toggle: function() {
			each(this, function(i, v) {
				css(v, 'display') == 'none' ? Q(v).show() : Q(v).hide()
			});
			return this
		},
		map: function(callback) {
			return Q.map(this, callback)
		},
		css: function(k, v) {
			var r = css(this, k, v);
			return isPlainObject(k) || (isString(k) && !isNull(v)) ? this : r
		},
		attr: function(k, v) {
			var r = attr(this, k, v);
			return (arguments.length > 1 || isPlainObject(k)) ? this : r
		},
		rmAttr: function(k) {
			each(this, function(i, v) {
				isDom(v) && v.removeAttribute(k)
			});
            return this;
		},
		data: function(k, v) {
			return data(this, k, v)
		},
		rmData: function(k) {
			each(this, function(i, v) {
				if (v.$Qmikdata) delete v.$Qmikdata[k]
			});
            return this;
		},
		val: function(v) {
			var me = this;
			if (isNull(v)) return me.attr("value") || "";
			each(me, function(i, u) {
				u.value = execObject(v)
			});
			me.emit("change");
			return me
		},
		next: function(s) {
			return upon(this, s, "next")
		},
		prev: function(s) {
			return upon(this, s, "prev")
		},
		clone: function(t) {
			return clone(this, t)
		},
		/*hover : function(fin, fout) {
			this.bind("mouseover", fin).bind("mouseout", fout).bind("touchstart", function() {
				fin();
				Q.delay(fout, 500)
			})
		},*/
		hasClass: function(c) {
			return hasClass(this[0], c)
		},
		closest: function(selector) { // 查找最近的匹配的父(祖父)节点
			var me = this,
				q = new Query();
			me.each(function(i, dom) {
				Q(selector, dom.parentNode).each(function(j, dom1) {
					dom === dom1 && q._push(dom)
				})
			});
			/**
			* selector:选择器 
			qmik:qmik查询对象 
			isAllP:是否包含所有父及祖父节点 默认true
			* isOnlyParent:往上查找的层级是否只到直接父节点 默认false
			*/
			return q.length > 0 ? q : parents(selector, me, !1)
		},
		parents: function(selector) { // 查找所有的匹配的父(祖父)节点
			return parents(selector, this, !0)
		},
		parent: function(selector) { // 查找匹配的父节点
			return parents(selector, this, !0, !0)
		},
		children: function(selector) { //查找直接子节点
			var r = new Query();
			var me = this;
			var isNullSelector = isNull(selector);
			me.each(function(i, dom) {
				//var childs = dom.childNodes;
				var childs = dom.children || dom.childNodes,
					j = 0,
					tdom;
				while (j < childs.length) {
					tdom = childs[j++];
					isDom(tdom) && (isNullSelector || matchesSelector(tdom, selector)) && r._push(tdom)
				}
			});
			return r
		}
	});
	fn.extend({
		removeClass: fn.rmClass,
		removeData: fn.rmData,
		removeAttr: fn.rmAttr
	});
	Q.isQmik = isQmik;
})(Qmik);