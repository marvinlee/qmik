/**
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.19
 */
(function(Q, define) {
	define(function(require, exports, module) {
		function fade(m, mode, speed, opacity, callback) {
			// 显示元素,并将元素值为0透明度(不可见)
			mode = mode == "in" ? !0 : !1;
			speed = speed <= 0 ? 1 : speed;
			opacity = (Q.isNum(opacity) ? opacity : (mode ? 0 : 1)) * 100;
			callback = Q.isFun(opacity) ? opacity : callback;
			m.show();
			var f = function(v) {
				if (!Q.isNum(v)) return;
				v = mode ? (v < opacity ? opacity : v) : (v > opacity ? opacity : v);
				m.css( {
					"opacity" : v / 100,
					"filter" : "alpha(opacity=" + v + ");"
				});
				v = parseInt(mode ? (v - speed) : (v + speed));
				if ((mode && v < opacity) || (!mode && v > opacity)) {
					callback && callback(m);
					return;
				}
				Q.delay(f, 10, v)
			}
			f(mode ? 100 : opacity / 2);
		}
		Q.fn.extend( {
			fadeIn : function(speed, opacity, callback) {
				fade(this, "in", speed, opacity, callback);
			},
			fadeOut : function(speed, opacity, callback) {
				fade(this, "out", speed, opacity, callback);
			}
		});
		module.exports = Q
	})
})(Qmik, Qmik.define);
