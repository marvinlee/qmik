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
		speed : 500,//动画速度
		delay : 5000,//每个场景之间的切换时间间隔
		loop : !0,//是否循环滑动
		direction : "horizontal" //vertical	
	};
	var toInt = parseInt;
	function Silder($container, conf) {
		var me = this;
		Q.extend(me, {
			config : Q.extend({}, conf, config),
			container : $container,
			ul : Q("ul", $container)
		});
		var lis = Q("li", me.ul);
		me.current = lis.first();
		me.offset = me.ul.offset();
		me.base = me.ul.offset();
		me.start = true;//从头开始
		me.ul.css("left", "-" + me.current.width() + "px");
		me.current.before(lis.last().clone(true));
		me.play();
	}
	Q.extend(Silder.prototype, {
		play : function() {
			var me = this;
			return Q.cycle(function() {
				me.next()
			}, this.config.delay)
		},
		stop : function() {
			clearTimeout(this.pid)
		},
		next : function() {
			var me = this, //
			$tar = getNext(me), //
			width = toInt($tar.attr("offsetWidth"));
			if ($tar.length > 0) {
				if (me.start) {
					me.ul.css({
						left : "0px"
					});
					me.ul.animate({
						left : "-" + width + "px"
					}, me.config.speed)
				} else {
					me.ul.animate({
						left : toInt(me.ul.position().left - width) + "px"
					}, me.config.speed)
				}
			} else {
				me.stop()
			}
		},
		prev : function() {
			var me = this, //
			$tar = getPrev(me), //
			width = toInt($tar.css("left"));
			if ($tar.length > 0) {
				me.ul.animate({
					left : toInt(me.ul.css("left")) - width,
					width : width
				}, me.config.speed)
			} else {
				me.stop()
			}
		}
	});
	function getNext(me) {
		var $tar = me.current.next("li");
		if ($tar.length < 1 && me.config.loop) {
			me.current = Q("li", me.ul).eq(1);
			me.start = true
		} else {
			me.start = false
		}
		me.current = $tar.length < 1 && me.config.loop ? Q("li", me.ul).eq(1) : $tar;
		return me.current
	}
	function getPrev(me) {
		var $tar = me.current.prev("li");
		me.current = $tar.length < 1 && me.config.loop ? Q("li", me.ul).last() : $tar;
		return me.current
	}
	Q.fn.extend({
		silder : function(conf) {
			this.css({
				overflow : "hidden"
			});
			return new Silder(this, conf);
		}
	})
	/*	Q.fn.silder = function(conf) {
			this.css({
				overflow : "hidden"
			});
			return new Silder(this, conf);
		};*/
	define(function(require, exports, module) {
		module.exports = Q
	})
})(Qmik, Qmik.define);
