(function(Q) {
	var win = window,
		doc = document;
	/** c语言的学法,防止多次加载,造成多次引入*/
	if (win.___View_JS__) {
		return;
	}
	win.___View_JS__ = true;
	var resizes = [];

	function View() {}
	Q.extend(View, {
		initView: function() {
			Q(function() {
				initViewSize();
				initEvent();
				onResize();
			});
		},
		addResize: function(fun) {
			fun && resizes.push(fun)
		},
		width: function() {
			return win.innerWidth
		},
		height: function() {
			return win.innerHeigh
		},
		//弹出内容
		pop: function(area) {
			area = Q(area);
			var posi = area.position();
			area.css({
				opacity: 1
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
		popAttach: function() {
			View._areaActive = Q(".c_g_li_active");
			View.pop(Q("#area_attach"));
		},
		//收起附件层
		hideAttach: function() {
			View.pop(View._areaActive || Q(".c_g_li")[0]);
		}
	});
	/** 初始化窗口大小 */
	function initViewSize() {
		//if(true)return;
		var width = win.innerWidth;
		var height = win.innerHeight;
		Q("body,.c_g_wrap,.c_g_li").css({
			width: width + "px",
			minHeight: height + "px"
		});
		Q(".c_g_li iframe").each(function(i,dom){
			dom.height = height+"px";
		});
	}

	function initEvent() {
		View.addResize(initViewSize); //添加窗口大小变化事件处理方法
		function noTrigBrowerEvent(e) {
			//e.stopPropagation();
			//e.preventDefault();
		}

		function trig(e) {
			var qtarget = Q(e.target);
			if (qtarget.attr("goType")) {
				switch (qtarget.attr("goType")) {
					case "goBack":
						Q.nav.back();
						return; //后退
					case "goForward":
						Q.nav.forward();
						return; //前进
					case "goQmik":
						Q.nav.use({
							module: "QmikAPI", //模块名
							method: "showHelpEnter", //方法名
							param: []
						});
						return;
				}
				return;
			}
			var type = qtarget.attr("trigType");
			if (type && type != e.type) {
				qtarget.trigger(type);
			}
			var module = Q.decode(qtarget.attr("mName")) || "";
			if (!Q.likeNull(module)) {
				var method = Q.decode(qtarget.attr("mMethod"));
				var param = Q.decode(qtarget.attr("mParam")).split(",") || [];
				Q.nav.use({
					module: module, //模块名
					method: method, //方法名
					param: param
				});
			}
		}
		//var isMobile = Q.isIphone() || Q.isAndroid() || Q.isWP();
		Q(doc).on({
			selectstart: function(e) {
				e.stopPropagation();
			},
			touchstart: function(e) {
				if (e.target.tagName == "A" && e.target.href) {
					return true;
				}
			},
			mousedown: function(e) {
				e.button == 0 && trig(e);
			},
			touchend: function(e) {
				trig(e);
			}
		});
	}
	/** 绑定resion事件 */
	function _onResize(e) {
		var availWidth = screen.availWidth;
		var inWidth = win.innerWidth;
		var scale = inWidth / availWidth;
		scale = (scale || 1) * 2;
		scale = scale > 1 ? 1 : scale;
		scale = scale < 0.75 ? 0.75 : scale;
		Q.each(resizes, function(i, fun) {
			try {
				fun && fun(scale);
			} catch (e) {
				Q.log(e);
			}
		})
	}

	function onResize() {
		Q(win).on({
			resize: _onResize
		});
	}

	Q.sun.define(function(require, exports, module) {
		module.gc = function() {
			win.___View_JS__ = false;
			Q(win).un("resize", _onResize);
		}
		window.View = module.exports = View
	});
})(Qmik);