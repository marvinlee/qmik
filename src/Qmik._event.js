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
		if (readyRE.test(doc.readyState)) fun(Q);
		else if (SE()) Q(doc).bind('DOMContentLoaded', fun, Q);
		else Q(doc).bind("readystatechange", fun, Q)
	}
	Q.ready = Q.fn.ready = function(fun) {
		ready(fun);
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
		var m = SE() ? this : e.target, fun, param, events = Q(m).data(ek) || {};
		each(events[e.type], function(i, v) {
			fun = v.fun;
			param = v.param || [];
			isFun(fun) && fun.apply(m, param.length < 1 ? [
				e
			] : param)
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
			Q("body").on(name, function(e) {
				if (Q(e.target.childNodes[0]).closest(this.selector).length > 0) {
					callback.apply(event.target, [
						e
					]);
				}
			})
			return this
		},
		die : function(name, callback) {
			each(Q(document.body), function(k, v) {
				Erm(v, name, callback)
			});
			return this
		}
	});
	Q.fn.extend( {
		bind : Q.fn.on,
		unbind : Q.fn.un
	});
})(Qmik);
