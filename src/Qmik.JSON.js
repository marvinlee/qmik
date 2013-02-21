/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.37
 */
(function() {
	function stringify(v) {
		var type = typeof v;
		switch(type) {
		case "number":
			return v;
		case "boolean":
		case "string":
		case "function":
			return "\"" + v + "\"";
		default:
			var r = [];
			if(v instanceof Array) {
				for(var i = 0; i < v.length; i++) r.push(stringify(v[i]));
				return "[" + r.join(",") + "]"
			} else if(v instanceof Date) return v.getTime() + "";
			else {
				for(var n in v) {
					r.push(n + ":" + stringify(v[n]))
				}
				return "{" + r.join(",") + "}"
			}
		}
	}
	var json = {
		stringify: function(v) {
			return stringify(v)
		},
		parseJSON: function(v) {
			if(v instanceof String) {
				if(v.match(/^\s*[\[{].*[\]}]\s*$/)) return eval('(' + v + ')')
			}
			throw new Error("value is not json")
		}
	}
	window.JSON = window.JSON || json;
})();