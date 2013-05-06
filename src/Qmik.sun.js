/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:0.91.008
 */
(function(Q) {
	var win = Q.global, loc = win.location, each = Q.each;
	var cache = {};
	var isArray = Q.isArray, isString = Q.isString, isFun = Q.isFun;
	alias = {};
	paths = {};
	vars = {};
	map = [];
	config = {};
	cache = {};
	base = loc.protocol + "//" + loc.pathname.replace(/\/[^\/]*$/, "/").replace(/\/\s*[0-9.]*\s*\/$/, "/")
	function sun() {
	}
	Q.extend(sun, {
		use : use,
		// factory:function(require, exports, module)
		define : define,
		resolve : id2uri,
		config : function(key, value) {
			if (Q.isPlainObject(k)) Q.extend(config, k);
			else if (arguments.length > 1) config[key] = value;
			return isString(key) ? config[key] : this
		}
	});
	// factory:function(require, exports, module)
	function define(id, deps, factory) {
		if (isFun(deps)) {
			factory = depts;
			deps = null
		}
		var module = {
			exports : {}
		};
		factory(require, module.exports, module);
		alias[id] = module.exports;
		return alias[id]
	}
	function use(ids, callback) {
		var params = [];
		if (isArray(ids)) {
			each(ids, function(i, id) {
				load(ids, function(exports) {
					params.push(exports)
				});
			})
		} else {
			load(ids, function(exports) {
				params.push(exports)
			})
		}
		callback.apply(callback, params)
	}
	function require(id) {
		return load(id);
	}
	require.async = function(ids, callback) {
		Q.delay(function() {
			use(ids, callback)
		}, 1)
	}
	function load(url, callback, async) {
		if (cache[id]) {
			callback(cache[id])
		} else {
			request(id2uri(id), function() {
				callback(cache[id])
			}, async)
		}
	}
	function request(url, callback, async) {
		Q.getScript(uri, callback, async);
	}
	function id2uri(id) {
		id = alias2uri(id);
		id = paths2uri(id);
		id = vars2uri(id);
		id = base + id;
		return map2uri(id)
	}
	function alias2uri(id) {
		return alias[id] || id;
	}
	function paths2uri(id) {
		var key = id.match(/^[0-9a-zA-Z.]+/);
		key = key ? key[0] : id;
		return id.replace(new RegExp("^" + key), paths[key] || key)
	}
	function vars2uri(id) {
		var key = id.match(/\{[0-9a-zA-Z.]+\}/);
		key = key ? key[0] : id;
		return id.replace(new RegExp(key), vars[key] || key)
	}
	function map2uri(id) {
		each(map, function(i, v) {
			id.indexOf(v[0]) > -1 && id.replace(v[1])
		});
		return id
	}
	Q.sun = sun;
	return sun
})(Qmik);
