function getStyle(o, a) {
	return o.currentStyle ? o.currentStyle[a] : document.defaultView.getComputedStyle(o, false)[a];
}
(function(Q) {
	var win = window,
		doc = document;

	var resizes = [];
	var areaActive = Q(".c_g_ul > .c_g_li")[0];
	var zIndex = 10;

	function View() {}
	Q.extend(View, {
		initView: initView, //初始化视图
		initEvent: initEvent, //初始化事件
		addResize: addResize, //添加窗口变动事件
		width: getWidth,
		height: getHeight,
		show:function(area){
			area = Q(area);
			var width = area.width();
			zIndex++;
			var posi = area.position();
			area.css({
				opacity: 1
			});
			Q(".c_g_li").removeClass("c_g_li_active");
			area.addClass("c_g_li_active");
			var x = -posi.left;
			//var mainArea = Q(".c_g_ul");
			var css = Q.cssPrefix({
				"transition": "0ms",
				"transform": "translateX(" + x + "px)",
				"z-index": zIndex
			});
			css.zIndex=zIndex;
			area.css(css);
			Q("#areaAttach").css(Q.cssPrefix({
				"transition": "0ms",
				"transform": "translateX(" + x + "px)",
				"display":"none"
			}));
			area.closest(".c_g_ul").css({
				height:area.height()+"px"
			})
		},
		//弹出内容
		pop: function(area) {
			area = Q(area);
			var width = area.width();
			zIndex++;
			var posi = area.position();
			area.css({
				opacity: 1
			});
			Q(".c_g_li").removeClass("c_g_li_active");
			area.addClass("c_g_li_active");
			var x = -posi.left;
			var mainArea = Q(".c_g_ul");
			area.css(Q.cssPrefix({
				"transition": "0ms",
				"transform": "translateX(" + width + "px)"
			}));
			var css = Q.cssPrefix({
				"transition": "400ms",
				"transform": "translateX(" + x + "px)",
				"z-index": zIndex
			});
			css.zIndex=zIndex;
			area.css(css);
		},
		//弹出附件层
		popAttach: function() {
			var me = this;
			areaActive = Q(".c_g_li_active");
			me.pop(Q("#areaAttach"));
		},
		//收起附件层
		hideAttach: function() {
			var me = this;
			me.pop(areaActive || Q(".c_g_li")[0]);
		}
	});
	Q.extend(View.prototype, View);

	function initView() {
		Q(function() {
			initViewSize();
		});
	}
	/** 初始化窗口大小 */
	function initViewSize() {
		//if(true)return;
		var width = getWidth();
		var height = getHeight();
		var fheight = height < screen.availHeight / 2 ? screen.availHeight / 2 : height;
		var headHeight = Q("#head").height();

		Q("body").css({
			width: width + "px",
			height: fheight + "px"
		});
		Q(".c_g_wrap").css({
			width: width + "px",
			height: fheight + "px"
		});
		width = Q(".c_g_wrap").width();
		var luHeight = fheight - headHeight;
		Q(".c_g_li iframe").each(function(i, dom) {
			dom.height = luHeight + "px";
			//Q(dom).css("height", luHeight+ "px");
		});
		Q(".c_g_li").css({
			width: width + "px",
			height: luHeight + "px"
		});
		Q.delay(function(){
			Q(".c_g_ul").css({
				width: "10000%"
			});
		},1000);
		
	}

	function addResize(fun) {
		fun && resizes.push(fun)
	}

	function getWidth() {
		var width = win.innerWidth;
		var parentWidth = $(parent.document.body).width()
		return Math.min(width,parentWidth);
	}

	function getHeight() {
		return win.innerHeigh
	}

	function initEvent() {
		onResize();
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
	function trigResize(e) {
		trigResize.state = 1;
		Q.delay(function() {
			trigResize.state = 0;
		}, 500);
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
		});
	}

	function onResize() {
		Q(win).on({
			resize: trigResize
		});
	}
	Q.sun.define(function(require, exports, module) {
		module.gc = function() {
			win.___View_JS__ = false;
			Q(win).un("resize", trigResize);
		}
		window.View = module.exports = View
	});
})(Qmik);