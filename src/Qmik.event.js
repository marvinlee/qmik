/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) { /* event */
	var win = Q.global, doc = win.document;
	var readyRE = /complete|loaded|interactive/, ek = "$QmikEvents";
	var isNull = Q.isNull, isFun = Q.isFun, isDom = Q.isDom, each = Q.each;
	function SE() {
		return !isNull(doc.addEventListener)
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
	Q.fn.ready = function(fun) {
		ready(fun);
		return this
	}
	function Eadd(dom, name, fun, paramArray) {
		var t = Q(dom), d = t.data(ek), h;
		if (isNull(d)) {
			d = {};
			t.data(ek, d)
		}
		h = d[name];
		if (!h) {
			d[name] = h = [];
			if (isFun(dom['on' + name])) h[0] = dom['on' + name];
			if (SE()) dom.addEventListener(name, handle, !1);
			else dom["on" + name] = handle;
		}
		if (isFun(fun)) h.push( {
			fun : fun,
			param : paramArray || []
		})
	}
	function Erm(o, n, f) {
		var s = Q(o).data(ek) || {}, h = s[n] || [], i = h.length - 1;
		if (f) for (; i >= 0; i--)
			h[i].fun == f && h.splice(i, 1);
		else if (isDom(o)) {
			if (SE()) o.removeEventListener(n, handle, !1);
			else o["on" + n] = null;
			delete s[n]
		}
	}
	function Etrig(o, n) {
		var e;
		if (SE() && isDom(o)) {
			switch (n) {
			case "hashchange":
				e = doc.createEvent("HashChangeEvent");
				break;
			default:
				e = doc.createEvent("MouseEvents");
			}
			e.initEvent(n, !0, !0);
			o.dispatchEvent(e)
		} else o.fireEvent('on' + n);
	}
	function handle(e) {
		e = e || fixEvent(win.event);
		var m = SE() ? this : e.target, f, p, h = Q(m).data(ek) || [];
		each(h[e.type], function(i, v) {
			f = v.fun;
			p = v.param || [];
			each(p, function(j, a) {
				if (Q.isEvent(a)) p[j] = e
			})
			isFun(f) && f.apply(m, p.length < 1 ? [
				e
			] : p)
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
		on : function(n, f) {
			var p = Array.prototype.slice.call(arguments, 2);
			each(this, function(k, v) {
				Q.isPlainObject(n) ? each(n, function(k, j) {
					Eadd(v, k, j, f)
				}) : Eadd(v, n, f, p)
			});
			return this
		},
		un : function(n, f) {
			each(this, function(k, v) {
				Erm(v, n, f)
			});
			return this
		},
		once : function(name, fun) {// 只执行一次触发事件,执行后删除
			var me = this, oneexec = function() {
				fun.apply(fun);
				me.un(name, oneexec)
			}
			me.on(name, oneexec)
		},
		trigger : function(n) {
			each(this, function(k, v) {
				Etrig(v, n)
			});
			return this
		},
		live : function(name, fun) {
			var selector = this.selector;
			Q("body").on(name, function(e) {
				if ($(e.target.childNodes[0]).closest(selector).length > 0) {
					fun.apply(event.target, [
						e
					]);
				}
			})
		},
		die : function(name, fun) {
			each(Q(document.body), function(k, v) {
				Erm(v, name, fun)
			});
			return this
		}
	});
	Q.fn.extend( {
		bind : Q.fn.on,
		unbind : Q.fn.un
	});
})(Qmik);
