/**
 * 滑动组件
 * 
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0 
 * 
 */
;
(function(Q, define) {
	var config = {
		speed : 200,//动画速度
		delay : 1200,//每个场景之间的切换时间间隔
		loop : !0,//是否循环滑动
		focus : !0,//有焦点时,才滚动
		cross : "x",//切换方向:默认水平方向	
		move : "next",//移动类型,默认向前移动,即显示下一个模块
	};
	var toInt = parseInt, toDouble = parseFloat, //
	gTranslate = "translate";
	function Silder($container, conf) {
		var me = this, ul = Q("ul", $container), lis = Q("li", ul), ulPos = ul.position();
		me.config = Q.extend({}, config, conf);
		Q.extend(me, {
			container : $container,
			ul : ul,
			first : lis.first(),
			last : lis.last(),
			width : lis.last().width(),
			height : lis.last().height(),
			left : ulPos.left,
			top : ulPos.top,
			current : lis.first(),
			_site : 0
		});
		$("#show2").html(me.width + "<>" + lis.length)
		Q.extend(me, {
			countWidth : me.width * lis.length,
			countHeight : me.height * lis.length
		});
		//前面插入最后一个图像
		me.first.before(lis.last().clone(true));
		//后面插入开始一个图像
		me.last.after(lis.first().clone(true));
		me.list = Q("li", ul);
		Q("img", me.list).css({
			width : me.width,
			height : me.height
		});
		if (me.isY()) {
			me.ul.css("top", -me.first.height());
			me.list.css({
				float : "none",
				clear : "both"
			})
		} else {
			me.ul.css("left", -me.first.width());
			me.list.css({
				float : "left"
			})
		}
		me.ul.css(Q.cssPrefix({
			"backface-visibility" : "hidden"
		}));
		me._initEvent();
		me.play();
	}
	Q.extend(Silder.prototype, {
		_initEvent : function() {
			var me = this, conf = me.config, //
			moveStart = 0, //
			move = "next", //
			isY = me.isY();
			window.onerror = function(e) {
				alert(e.message);
			}
			me.ul.on({
				"touchstart" : function(e) {
					me.stop();
					if (me.isPrev()) {
						length = isY ? me.height : me.width;
						var countLength = isY ? me.countHeight : me.countWidth;
						me.current.prev("li").length < 1 && me._initPosition(-countLength + length);
					} else {
						me.current.next("li").length < 1 && me._initPosition();
					}
					var touche = e.touches[0];
					moveStart = isY ? touche.clientY : touche.clientX;
					e.stopPropagation();
					e.preventDefault();
				},
				"touchmove" : function(e) {
					var touche = e.touches[0];
					var diff = (isY ? touche.clientY : touche.clientX) - moveStart;
					move = diff > 0 ? "prev" : "next";
					//setCurrentByPos(me);
					moveStart = touche.clientX;
				},
				"touchend" : function(e) {
					if (move == "prev") {
						me.prev()
					} else {
						me.next();
					}
					me.play();
				}
			});
		},
		_initPosition : function(mov) {
			mov = mov || 0;
			var me = this, //
			translate = gTranslate + (me.isY() ? "Y" : "X") + "(" + mov + "px)";
			me._site = mov;
			me.ul.css(Q.cssPrefix({
				"transition" : "0ms",
				"transform" : translate
			}));
			me.current = me.isPrev() ? me.last : me.first
		},
		//是否是垂直方向
		isY : function() {
			return this.config.cross == "y"
		},
		isPrev : function() {
			return this.config.move == "prev"
		},
		play : function() {
			var me = this, conf = me.config;
			me.thread && me.thread.stop();
			me.thread = Q.cycle(function() {
				me.isPrev() ? me.prev() : me.next()
			}, conf.speed + conf.delay)
		},
		stop : function() {
			var me = this;
			me.thread.stop();
			me.ul.css(Q.cssPrefix({
				"transition" : "0s"
			}))
		},
		isToggle : function() {
			return this.focus ? document.hasFocus() : !0
		},
		next : function(callback) {
			var me = this, conf = me.config, //
			isY = me.isY(), //
			$tar = getNext(me), //
			translate = gTranslate + (isY ? "Y" : "X"), //
			length = isY ? me.height : me.width;
			if ($tar && $tar.length > 0) {
				if (me.isToggle()) {
					me._site -= length;
					me.ul.css(Q.cssPrefix({
						"transition" : conf.speed + "ms",
						"transform" : translate + "(" + me._site + "px)"
					}));
					me._threadSite && me._threadSite.stop();
					me._threadSite = Q.delay(function() {
						me.current[0] == me.list.last()[0] && me._initPosition();
						callback && callback(me);
					}, conf.speed + conf.delay - 10)
				}
			} else {
				me.stop()
			}
		},
		prev : function(callback) {
			var me = this, conf = me.config, //
			isY = me.isY(), //
			$tar = getPrev(me), //
			translate = gTranslate + (isY ? "Y" : "X"), //
			length = isY ? me.height : me.width;
			if ($tar && $tar.length > 0) {
				if (me.isToggle()) {
					var countLength = isY ? me.countHeight : me.countWidth;
					me._site += length;
					me.ul.css(Q.cssPrefix({
						"transition" : conf.speed + "ms",
						"transform" : translate + "(" + me._site + "px)"
					}));
					me._threadSite && me._threadSite.stop();
					me._threadSite = Q.delay(function() {
						me.current[0] == me.list.first()[0] && me._initPosition(-countLength + length);
						callback && callback(me);
					}, conf.speed + conf.delay - 10)
				}
			} else {
				me.stop()
			}
		},
	});
	function getNext(me) {
		me.current = me.current.next("li");
		//me.current.length < 1 && me._initPosition();
		return me.config.loop ? me.current : me.current[0] == me.list.last()[0] ? null : me.current
	}
	function getPrev(me) {
		me.current = me.current.prev("li");
		//me.current.length < 1 && me._initPosition();
		return me.config.loop ? me.current : me.current[0] == me.list.first()[0] ? null : me.current
	}
	function getTransform(me) {
		var transform = /-?\d+/.exec(me.ul.css(Q.cssPrefix("transform")));
		return transform ? toInt(transform[0]) : 0;
	}
	function setCurrentByPos(me) {
		var site = getTransform(me);
		var idx = Math.floor(site / me.width) + 1;
		me.current = me.list[idx];
	}
	Q.fn.extend({
		silder : function(conf) {
			this.css({
				overflow : "hidden"
			});
			return new Silder(this, conf)
		}
	});
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
