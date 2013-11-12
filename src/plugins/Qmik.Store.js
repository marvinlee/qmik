/**
 * //存储框架 包含localStorage,sessionStorage,cookie
 */
;
(function(Q) {
	// 声明
	var win = window, doc = document, local = win.localStorage, session = win.sessionStorage;
	var encode = encodeURIComponent, decode = decodeURIComponent;
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
		if (doc.cookie) doc.cookie = str
	}
	function getCookie(key) {// 取cookies函数
		if (doc.cookie) {
			var arr = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
			return arr != null ? unescape(arr[2]) : null;
		}
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
	var Store = {
		setLocal : function(key, value, ttl) {// 储存到localStorage,ttl:unit
			// is
			// second
			ttl = ttl || -1;
			var item = {
				__data : value,
				__ttl : ttlTime(ttl)
			};
			local && local.setItem(encode(key), encode(JSON.stringify(item)))
		},
		setSession : function(key, value, ttl) {// 储存到sessionStorage,ttl:unit
			// is
			// second
			ttl = ttl || -1;
			var item = {
				__data : value,
				__ttl : ttlTime(ttl)
			};
			session && session.setItem(encode(key), encode(JSON.stringify(item)))
		},
		// 储存到cookie,ttl:unit is second
		setCookie : function(key, value, ttl, domain) {
			setCookie(key, value, ttl, domain)
		},
		getLocal : function(key) {
			var item = local ? parseJSON(decode(local.getItem(encode(key)))) : null;
			if (item && item.__data && item.__ttl) {
				if (item.__ttl >= 0 && item.__ttl <= new Date().getTime()) {
					Store.rmLocal(key);
					return null
				}
				return item.__data
			}
			return null
		},
		getSession : function(key) {
			var item = session ? parseJSON(decode(session.getItem(encode(key)))) : null;
			if (item && item.__data && item.__ttl) {
				if (item.__ttl >= 0 && item.__ttl <= new Date().getTime()) {
					Store.rmSession(key);
					return null
				}
				return item.__data
			}
			return null
		},
		getCookie : function(key) {
			return getCookie(key)
		},
		rmLocal : function(key) {
			local.removeItem(encode(key))
		},
		rmSession : function(key) {
			session.removeItem(encode(key))
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
	};
	(function gc(){
		Q.cycle(function(){
			if(local){
				try{
					for(var key in local){
						Store.getLocal(key);;
					}
				}catch(e){}
			}
		},60 * 1000);
	})();
	Q.Store = Store;
	Q.sun && Q.sun.define && Q.sun.define(function(require, exports, module) {
		module.exports = Q
	});
})($);
