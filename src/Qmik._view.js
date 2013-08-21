/**
 * @author:le0
 * @email:cwq0312@163.com
 * @version:1.00.000
 */
(function(Q) {// location位置+效果
	var win = Q.global, doc = win.document, isNull = Q.isNull, isDom = Q.isDom;
	// 计算元素的X(水平，左)位置
	function pageX(elem) {
		return elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft
	}
	// 计算元素的Y(垂直，顶)位置
	function pageY(elem) {
		return elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop
	}
	// 查找元素在其父元素中的水平位置
	function parentX(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetLeft : pageX(elem) - pageX(elem.parentNode)
	}
	// 查找元素在其父元素中的垂直位置
	function parentY(elem) {
		return elem.parentNode == elem.offsetParent ? elem.offsetTop : pageY(elem) - pageY(elem.parentNode)
	}
	Q.fn.extend({
		width : function(v) {
			var dom = this[0];
			return isDom(dom) ? dom.offsetWidth : dom == win ? screen.availWidth : 0
		},
		height : function(v) {
			var dom = this[0];
			return isDom(dom) ? dom.offsetHeight : dom == win ? screen.availHeight : 0
		},
		offset : function() {// 获取匹配元素在当前视口的相对偏移
			if (!this[0]) return null;
			var obj = this[0].getBoundingClientRect();
			return {
				left : obj.left + win.pageXOffset,
				top : obj.top + win.pageYOffset
			};
		},
		position : function() {// 获取匹配元素相对父元素的偏移。
			var o = this[0];
			if (!o) return null;
			return {
				left : parentX(o),
				top : parentY(o)
			}
		},
		animate : function(styles, speed, easing, callback) {
			var me = this, mul = 20, speed = speed || 500, stardStyle = {}, source, target;
			var toDouble = parseFloat;
			Q.each(styles, function(key, val) {
				stardStyle[key] = Math.abs(toDouble(val) - toDouble(me.css(key) || 0))
			});
			function Animate() {
				var me1 = this;
				me1.thread = Q.cycle(function() {
					var mstyle = {}, isDelay = !1;
					Q.each(styles, function(key, val) {
						val = toDouble(val);
						target = val;
						source = toDouble(me.css(key) || 0);
						if (target >= source) {
							mstyle[key] = (source + stardStyle[key] / mul) + "px";
							isDelay = source >= val - 1 ? !1 : !0
						} else {
							mstyle[key] = (source - stardStyle[key] / mul) + "px";
							isDelay = source <= val + 1 ? !1 : !0
						}
					});
					me.css(mstyle);
					!isDelay && me1.stop()
				}, speed / mul)
			}
			Animate.prototype.stop = function() {
				this.thread.stop();
				me.css(styles);
				callback && callback()
			}
			return new Animate()
		}
	});
})(Qmik);
