/**
 * @author:leo
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) { /* event */
	var win = Q.global, doc = win.document, fn = Q.fn, _in = Q._in;
	var SE = _in.isSE, readyRE = /complete|loaded|interactive|loading/i, // /complete|loaded|interactive/
	ek = "$QEvents", liveFuns = {};
	var isNull = Q.isNull, isFun = Q.isFun, each = Q.each;
	/** 设置节点的加载成功方法 */
	function setLoad(node, fun) {
		node.onreadystatechange = node.onload = node.onDOMContentLoaded = fun
	}
	Q.ready = fn.ready = function(fun, context) {
		var node = context || this[0] || doc, state;
		function ready(e) {
			state = node.readyState;
			if (state != "loading" && !isNull(node.$$handls) && (readyRE.test(state) || (isNull(state) && "load" == e.type))) {
				setLoad(node, null);
				each(node.$$handls, function(i, val) {
					val(e);
				});
				delete node.$$handls
			}
		}
		if (readyRE.test(node.readyState)) {
			Q.delay(function() {
				fun.call(node, _in.createEvent("MouseEvents"))
			}, 1);
		} else {
			var hs = node.$$handls = node.$$handls || [];
			hs.push(fun);
			/*Q(node).on({
				"DOMContentLoaded" : ready,
				"readystatechange" : ready,
				"load" : ready
			});*/
			setLoad(node, ready)
		}
		return this
	}
	function Eadd(dom, name, fun, paramArray) {
		var t = Q(dom), d = t.data(ek) || {}, h = d[name];
		t.data(ek, d);
		if (!h) {
			d[name] = h = [];
			//isFun(dom['on' + name]) ? (h[0] = dom['on' + name]) : SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
			if (isFun(dom['on' + name])) {
				h.push({
					fun : dom['on' + name],
					param : []
				});
				delete dom['on' + name];
			}
			SE() ? dom.addEventListener(name, handle, !1) : dom["on" + name] = handle
		}
		isFun(fun) && h.push({
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
				e = _in.createEvent("HashChangeEvent");
				break
			default:
				e = _in.createEvent("MouseEvents");
			}
			e.initEvent(name, !0, !0);
			dom.dispatchEvent(e)
		} else dom.fireEvent('on' + name)
	}
	function handle(e) {
		e = fixEvent(e || win.event);
		var retVal, m = this, fun, param, events = Q(m).data(ek) || {};
		each(events[e.type], function(i, v) {
			try{
				fun = v.fun;
				param = v.param || [];
				if (isFun(fun)) {
					retVal = fun.apply(m, [
						e
					].concat(param));
					//if (!isNull(retVal)) e.returnValue = retVal
					//兼容ie处理
					if (!isNull(retVal)) {
						e.returnValue = retVal;
						if (win.event) win.event.returnValue = retVal;
					}
				}
			}catch(e){Q.log(e.message,e)}
		})
	}
	function fixEvent(e) {
		e.preventDefault || (e.preventDefault = function() {
			this.returnValue = !1;
			if (win.event) win.event.returnValue = !1;
		});
		e.stopPropagation || (e.stopPropagation = function() {
			this.cancelBubble = !0
		});
		e.target || (e.target = e.srcElement);
		return e
	}
	function getLiveName(selector, type, callback) {
		return selector + ":live:" + type + ":" + (callback || "").toString()
	}
	fn.extend({
		on : function(name, callback) {
			var p = [].slice.call(arguments, 2);
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
			function oneexec(e) {
				callback(e);
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
			var select = this.selector;
			var names = name;
			if(!Q.isPlainObject(name)){
				names={};
				names[name]=callback
			}
			each(names,function(key,callback){
				var fun = liveFuns[getLiveName(select, key, callback)] = function(e) {
					var me = e.target,_me=Q(me);
					if ( Q.isString(select) ? _me.closest(select).length > 0 : 
							Q.isDom(select) ? Q.inArray(select, _me.parents()) >= 0 : 0) {
						callback.apply(me, [
							e
						])
					}
				};
				Q("body").on(key, fun)
			});
			return this
		},
		die : function(name, callback) {
			var fun = liveFuns[getLiveName(this.selector, name, callback)];
			each(Q(document.body), function(k, dom) {
				Erm(dom, name, fun)
			});
			return this
		}
	});
	fn.extend({
		bind : fn.on,
		unbind : fn.un,
		off : fn.un
	});
	/**
	 * event orientationchange:重力感应,0：与页面首次加载时的方向一致 -90：相对原始方向顺时针转了90° 180：转了180°
	 * 90：逆时针转了 Android2.1尚未支持重力感应
	 */
	var qwc = "click blur focus scroll resize".split(" ");
	each(qwc, function(i, v) {
		fn[v] = function(f) {
			return f ? this.on(v, f) : this.trigger(v)
		}
	})
})(Qmik);
