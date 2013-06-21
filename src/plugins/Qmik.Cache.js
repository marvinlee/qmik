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
