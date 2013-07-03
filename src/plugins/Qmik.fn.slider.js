/**
 * 滑动组件
 * 
 * @author:leochen
 * @email:cwq0312@163.com
 * @version:1.0 
 * 
 */
(function(Q, define) {
	var config = {
		speed : 200,//动画速度
		delay : 1200,//每个场景之间的切换时间间隔
		loop : !0,//是否循环滑动
		direction : "horizontal" //vertical	
	};
	var toInt = parseInt, toDouble = parseFloat;
	function Silder($container, conf) {
		var me = this, ul = Q("ul", $container), lis = Q("li", ul);
		Q.extend(me, {
			config : Q.extend({}, config, conf),
			container : $container,
			ul : ul,
			current : lis.first(),
			first : lis.first(),
			last : lis.last(),
			left : ul.position().left,
			width : lis.last().width(),
			height : lis.last().height(),
			start : true
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
		if (me.isVertical()) {
			me.ul.css("top", "-" + me.first.height());
			me.list.css({
				float : "none",
				clear : "both"
			})
		} else {
			me.ul.css("left", "-" + me.first.width());
			me.list.css({
				float : "left"
			})
		}
		me.initEvent();
		me.play();
	}
	Q.extend(Silder.prototype, {
		initEvent : function() {
			var me = this;
			me.container.on("touchstart", function(e) {
				e.stopPropagation();
				e.preventDefault();
			})
		},
		//是否是垂直方向
		isVertical : function() {
			return this.config.direction == "vertical"
		},
		play : function() {
			var me = this;
			me.thread = Q.cycle(function() {
				me.next()
			}, this.config.delay)
		},
		stop : function() {
			this.thread.stop();
		},
		next : function() {
			var me = this;
			me.isVertical() ? me.moveTop() : me.moveLeft();
		},
		prev : function() {
			var me = this;
			me.isVertical() ? me.moveBottom() : me.moveRight();
		},
		/**
		 * 往左边滑动
		 */
		moveLeft : function() {
			var me = this, //
			$tar = getNext(me), //
			thread, //
			width = me.width;
			if ($tar.length > 0) {
				if (document.hasFocus()) {
					thread && thread.stop();
					thread = me.ul.animate({
						left : me.start ? -2 * width : me.ul.position().left - width
					}, me.config.speed, null, function() {
						if (me.current[0] == me.list.last()[0]) {
							me.ul.css("left", -width);
							me.current = me.first
						}
					})
				}
			} else {
				me.stop()
			}
		},
		moveRight : function() {
			var me = this, //
			$tar = getPrev(me), //
			thread, //
			width = me.width;
			if ($tar.length > 0) {
				if (document.hasFocus()) {
					thread && thread.stop();
					var countWidth = width * (me.list.length - 2)
					me.ul.animate({
						left : me.start ? -countWidth : me.ul.position().left + width
					}, me.config.speed, null, function() {
						if (me.current[0] == me.list.first()[0]) {
							me.ul.css("left", -countWidth);
							me.current = me.last
						}
					})
				}
			} else {
				me.stop()
			}
		},
		/**
		 * 往上边滑动
		 */
		moveTop : function() {
			var me = this, //
			thread, //
			$tar = getNext(me), //
			height = me.height;
			if ($tar.length > 0) {
				if (document.hasFocus()) {
					thread && thread.stop();
					me.ul.animate({
						top : me.start ? -2 * height : me.ul.position().top - height
					}, me.config.speed, null, function() {
						if (me.current[0] == me.list.last()[0]) {
							me.ul.css("top", -height);
							me.current = me.first
						}
					})
				}
			} else {
				me.stop()
			}
		},
		/**
		 * 往下边滑动
		 */
		moveBottom : function() {
			var me = this, //
			$tar = getPrev(me), //
			thread, //
			height = me.height;
			if ($tar.length > 0) {
				if (document.hasFocus()) {
					thread && thread.stop();
					var countHeight = height * (me.list.length - 2)
					me.ul.animate({
						top : me.start ? -countHeight : me.ul.position().top + height
					}, me.config.speed, null, function() {
						if (me.current[0] == me.list.first()[0]) {
							me.ul.css("top", -countHeight);
							me.current = me.last
						}
					})
				}
			} else {
				me.stop()
			}
		}
	});
	function getNext(me) {
		var $tar = me.current.next("li");
		if (($tar.length < 1) && me.config.loop) {
			//me.ul.css("left", "-" + me.width);
			me.current = me.list.first();
			me.start = true
		} else {
			me.current = $tar;
			me.start = false
		}
		return me.current
	}
	function getPrev(me) {
		var $tar = me.current.prev("li");
		if (($tar.length < 1) && me.config.loop) {
			//me.ul.css("left", "-" + (me.width * (me.list.length - 2)));
			me.current = me.list.last();
			me.start = true
		} else {
			me.current = $tar;
			me.start = false
		}
		return me.current
	}
	Q.fn.extend({
		silder : function(conf) {
			this.css({
				overflow : "hidden"
			});
			return new Silder(this, conf);
		}
	});
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
