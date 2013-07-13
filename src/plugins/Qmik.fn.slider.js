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
			_site : 0,
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
			var me = this;
			/*			me.container.on("touchstart", function(e) {
							//e.stopPropagation();
							//e.preventDefault();
							//me.stop()
						});*/
		},
		_initPosition : function(mov) {
			var me = this, mov = mov || 0, //
			translate = gTranslate + (me.isY() ? "Y" : "X") + "(" + mov + "px)";
			me._site = mov;
			me.ul.css(Q.cssPrefix({
				"transition" : "0s",
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
			me.thread = Q.cycle(function() {
				me.isPrev() ? me.prev() : me.next()
			}, conf.speed + conf.delay)
		},
		stop : function() {
			this.thread.stop();
			me.ul.css(Q.cssPrefix({
				"transition" : "0s"
			}))
		},
		isToggle : function() {
			return this.focus ? document.hasFocus() : !0
		},
		next : function() {
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
					Q.delay(function() {
						me.current[0] == me.list.last()[0] && me._initPosition();
					}, conf.speed + conf.delay - 50)
				}
			} else {
				me.stop()
			}
		},
		prev : function() {
			var me = this, conf = me.config, //
			isY = me.isY(), //
			$tar = getPrev(me), //
			translate = gTranslate + (isY ? "Y" : "X"), //
			length = isY ? me.height : me.width;
			if ($tar && $tar.length > 0) {
				if (me.isToggle()) {
					var countLength = length * (me.list.length - 2);
					me._site += length;
					me.ul.css(Q.cssPrefix({
						"transition" : conf.speed + "ms",
						"transform" : translate + "(" + me._site + "px)"
					}));
					Q.delay(function() {
						me.current[0] == me.list.first()[0] && me._initPosition(-countLength + length);
					}, conf.delay)
				}
			} else {
				me.stop()
			}
		},
	});
	function getNext(me) {
		me.current = me.current.next("li");
		return me.config.loop ? me.current : me.current[0] == me.list.last()[0] ? null : me.current
	}
	function getPrev(me) {
		me.current = me.current.prev("li");
		return me.config.loop ? me.current : me.current[0] == me.list.first()[0] ? null : me.current
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
