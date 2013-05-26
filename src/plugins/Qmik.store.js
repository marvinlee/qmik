/**
 * //存储框架 包含localStorage,sessionStorage,cookie
 */
;
(function(Q, define) {
	// 声明
	var local = localStorage, session = sessionStorage, win = window, doc = document;
	function setCookie(key, value, ttl, domain) {// 两个参数，一个是cookie的名子，一个是值
		ttl = ttl || 30 * 24 * 60 * 60;
		var exp = new Date(), str;
		str = key + "=" + escape(value);
		if (domain) str += ";domain=" + domain;
		if (ttl < 0) {
			exp.setTime(exp.getTime() - 10)
		} else {
			exp.setTime(exp.getTime() + ttl * 1000)
		}
		str += ";expires=" + exp.toGMTString();
		doc.cookie = str
	}
	function getCookie(key) {// 取cookies函数
		var arr = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
		return arr != null ? unescape(arr[2]) : null;
	}
	function rmCookie(key, domain) {// 删除cookie
		setCookie(key, "", -1, domain)
	}
	function parseJSON(value) {
		try {
			return JSON.parse(value)
		} catch (e) {
			return value
		}
	}
	function ttlTime(ttl) {
		return ttl < 0 ? ttl : new Date().getTime() + ttl * 1000;
	}
	var store = {
		setLocal : function(key, value, ttl) {// 储存到localStorage,ttl:unit
			// is
			// second
			ttl = ttl || -1;
			var item = {
				__data : value,
				__ttl : ttlTime(ttl)
			};
			local && local.setItem(key, JSON.stringify(item))
		},
		setSession : function(key, value, ttl) {// 储存到sessionStorage,ttl:unit
			// is
			// second
			ttl = ttl || -1;
			var item = {
				__data : value,
				__ttl : ttlTime(ttl)
			};
			session && session.setItem(key, JSON.stringify(item))
		},
		// 储存到cookie,ttl:unit is second
		setCookie : function(key, value, ttl, domain) {
			setCookie(key, value, ttl, domain)
		},
		getLocal : function(key) {
			var item = local ? parseJSON(local.getItem(key)) : null;
			if (item && item.__data && item.__ttl) {
				if (item.__ttl >= 0 && item.__ttl <= new Date().getTime()) {
					Store.rmLocal(key);
					return null
				}
				return item.__data
			}
			return item
		},
		getSession : function(key) {
			var item = session ? parseJSON(session.getItem(key)) : null;
			if (item && item.__data && item.__ttl) {
				if (item.__ttl >= 0 && item.__ttl <= new Date().getTime()) {
					Store.rmSession(key);
					return null
				}
				return item.__data
			}
			return item
		},
		getCookie : function(key) {
			getCookie(key)
		},
		rmLocal : function(key) {
			local.removeItem(key)
		},
		rmSession : function(key) {
			session.removeItem(key)
		},
		rmCookie : function(key, domain) {
			rmCookie(key, domain)
		},
		clearLocal : function() {
			local && local.clear()
		},
		clearSession : function() {
			session && session.clear()
		},
		clearCookie : function() {
			var arr = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
			for ( var i in arr) {
				setCookie(arr[i], "", -1, "")
			}
		}
	}
	Q.store = store;
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
