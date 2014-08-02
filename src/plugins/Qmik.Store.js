/**
 * //存储框架 包含localStorage,sessionStorage,cookie
 */
;
(function(Q) {
	// 声明
	var win = window,
		doc = document,
		local = win.localStorage,
		session = win.sessionStorage || {};
	var encode = encodeURIComponent,
		decode = decodeURIComponent,
		prefixCache =  location.pathname + "/"; //key前辍;

	function setCookie(key, value, ttl, domain) { // 两个参数，一个是cookie的名子，一个是值
		ttl = ttl || 30 * 24 * 60 * 60;
		var exp = new Date(),
			str;
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

	function getCookie(key) { // 取cookies函数
		if (doc.cookie) {
			var arr = doc.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
			return arr != null ? unescape(arr[2]) : null;
		}
	}

	function parseJSON(value) {
		try {
			return JSON.parse(value)
		} catch (e) {
			return value
		}
	}
	function getKey(key){
		return prefixCache + key;
	}
	function ttlTime(ttl) {
		return ttl < 0 ? ttl : new Date().getTime() + ttl * 1000;
	}

	var Store = {
		set: function(key, value, ttl) { // 储存到localStorage,ttl:unit
			try {
				key = getKey(key);
				ttl = ttl || 60 * 60; //默认1小时
				var item = {
					data: value,
					ttl: ttlTime(ttl)
				};
				if (local) local[key] = JSON.stringify(item);
			} catch (e) {
				Q.log(e);
			}
		},
		setSession: function(key, value, ttl) { // 储存到sessionStorage,ttl:unit
			try {
				key = getKey(key);
				var item = {
					data: value
				};
				session[key] = JSON.stringify(item);
			} catch (e) {
				Q.log(e, e.stack);
			}
		},
		get: function(key) {
			try {
				if (!local) {
					return null;
				}
				key = getKey(key);
				var value = local[key];
				if (value) {
					var item = parseJSON(value);
					if (item && !Q.isNull(item.data) && item.ttl) {
						if (item.ttl >= 0 && item.ttl <= new Date().getTime()) {
							Store.remove(key);
							return null
						}
						return item.data
					}
				}
			} catch (e) {
				Q.log(e, e.stack);
			}
			return null
		},
		getSession: function(key) {
			try {
				key = getKey(key);
				var val = session[key];
				if (val) {
					var item = parseJSON(session[key]);
					return item.data
				}
			} catch (e) {
				Q.log(e, e.stack);
			}
			return null
		},
		getCookie: getCookie,
		remove: function(key) {
			key = getKey(key);
			delete local[key];
		},
		removeSession: function(key) {
			key = getKey(key);
			delete session[key];
		},
		clear: function() {
			if (local) local.clear();
		},
		clearSession: function() {
			try {
				session.clear()
			} catch (e) {
				session = {};
			}
		}
	};
	function to2Bit(val){
		return val < 10 ? "0"+val : val
	}
	Q.sun.define("lib/qmik/Store", function(require, exports, module) {
		module.exports = Store;
	});
	//清除缓存
	(function() {
		var date = new Date();
		var key = "sys";
		var hhmm = parseInt(to2Bit(date.getHours()) + "" + to2Bit(date.getMinutes()));
		if (Store.get(key) != true) {
			try {
				for (var key in local) {
					if (new RegExp("^" + prefixCache).test(key)) {
						key = key.replace(prefixCache, "");
						Store.get(key);
					}
				}
			} catch (e) {
				Q.log(e, stack);
			}
			Store.set(key, true, 24 * 60 * 60); //1天清除一次
		}
	})();//

})(Qmik);