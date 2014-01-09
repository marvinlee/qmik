/**
 *基础类,action层实现继承自此类
 *
 */
(function(Q) {
	var win = window,
		doc = document;
	var isOnModule = false;
	var config = {
		popTime: 250, //500ms
		slideTime: 400, //滑动时间差
		mobileMaxWidth: 480,
		diff: 20
	};

	Q().ready(function() {
		var minHeight = win.innerHeight;

		function noTrigBrowerEvent(e) {
			//e.stopPropagation();
			//e.preventDefault();
		}

		function trig(e) {
			var qtarget = Q(e.target);

			if (qtarget.attr("go-type")) {
				switch (qtarget.attr("go-type")) {
					case "go-back":
						Q.nav.back();
						return; //后退
					case "go-forward":
						Q.nav.forward();
					return; //前进
					case "go-qmik":
						Q.nav.use({
							module: "QmikAPI", //模块名
							method: "showHelpEnter", //方法名
							param: []
						});
						return;
				}
				return;
			}
			var type = qtarget.attr("trig-type");
			if (type && type != e.type) {
				qtarget.trigger(type);
			}
			var module = Q.decode(qtarget.attr("m-name")) || "";
			if (!Q.likeNull(module)) {
				var method = Q.decode(qtarget.attr("m-method"));
				var param = Q.decode(qtarget.attr("m-param")).split(",") || [];
				Q.nav.use({
					module: module, //模块名
					method: method, //方法名
					param: param
				});
			}
		}
		//var isMobile = Q.isIphone() || Q.isAndroid() || Q.isWP();
		Q(document).on({
			selectstart: function(e) {
				e.stopPropagation();
			},
			touchstart: function(e) {
				if (e.target.tagName == "A" && e.target.href) {
					return;
				}
			},
			mousedown: function(e) {
				e.button == 0 && trig(e);
			},
			touchend: function(e) {
				trig(e);
			}
		});
	});
	
	function BaseAct() {}
	Q.extend(BaseAct.prototype, {
		width: function() {
			var width = win.innerWidth;
			//width = width > config.mobileMaxWidth ? config.mobileMaxWidth : width;
			return width;
		},
		height: function() {
			return win.innerHeight;
		},
		config: function(conf) {
			Q.config(config, conf);
		},
		//弹出内容
		pop: function(area) {
			area = Q(area);
			var posi = area.position();
			area.css({
				opacity:1
			});
			Q(".c_g_li").removeClass("c_g_li_active");	
			area.addClass("c_g_li_active");
			var x = -posi.left;
			var mainArea = Q(".c_g_ul");
			mainArea.css(Q.cssPrefix({
				"transition": config.popTime + "ms",
				"transform": "translateX(" + x + "px)"
			}));
		},
		//弹出附件层
		popAttach:function(){
			var me = this;
			me._areaActive = Q(".c_g_li_active");
			me.pop(Q("#area_attach"));
		},
		//收起附件层
		hideAttach:function(){
			var me = this;
			me.pop(me._areaActive || Q(".c_g_li")[0]);
		}
	});
	Q.sun.define(function(require, exports, module) {
		module.exports = BaseAct
	});
})($);