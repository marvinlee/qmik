/*
 *下面代码抄到Qmik.nav插件里的滑动判断
 *	tab菜单类,用来生成tab菜单,及触发基本事件效果
 	使用:new Tab({
          data:data.tabs,//tab数组,格式:[{id:"xx",name:"xx"},{},{}...]
          container:Q("#w3ColListTop"),添加到的容器节点
          click:function(e){//单击回调事件

          }
        });
 *	
 */
(function(Q) {

	function TabView(opt) {
		var me = this;
		var dataSource = opt.dataSource;
		var container = opt.container;
		var click = opt.click;
		var html = me.makeTabHtml(dataSource);
		var qtop = Q(container);
		Q(".tab", qtop).remove();
		qtop.append(html);
		var qtab = Q(".tab", qtop);
		var qtabItems = Q(".tab > li", qtop);
		me._config = opt;
		me.items = qtabItems;
		me.container = container;
		me.tab = qtab;
		var countWidth = 0;
		var last = Q(".tab > li", qtop).last();
		countWidth += last.position().left + last.width();
		me.width = countWidth;
		me.isMove = me.width > container.parent().width();

		//如果没有绑定过事件,就绑定下
		if (qtop.attr("bindSlide") != "true") {
			qtop.attr("bindSlide", "true");
			////////////////////////
			var oStart = {
				x: 0,
				y: 0
			};
			var oDiff = {
				x: 0,
				y: 0
			};
			var startLeft = 0;
			var isStart = false;
			var isTrigClick = true;

			function _start(e) {
				isStart = true;
				isTrigClick = true;
				var touch = e.touches ? e.touches[0] : e;
				oStart.x = touch.clientX;
				oStart.y = touch.clientY;
				startLeft = qtab.position().left;
				stop(e);
			}

			function _move(e) {
				if (isStart != true || !me.isMove) {
					return;
				}
				var touch = e.touches ? e.touches[0] : e;
				oDiff.x = touch.clientX - oStart.x;
				oDiff.y = touch.clientY - oStart.y;
				var left = startLeft + oDiff.x;
				qtab.css({
					left: left + "px",
					//"-webkit-transform": "translateX(" + left + "px)",
					"transform": "translateX(" + -left + "px)",
					"transition": "0ms"
				});
				stop(e);

				isTrigClick = false;
			}

			function stop(e) {
				e.preventDefault();
				//e.stopPropagation();
			}

			function isLimitStart() {

			}

			function _end(e) {
				if(me.isMove){
					isStart = false;
					var left = parseInt(qtab.css("left"));
					var viewWidth = qtop.width();
					viewWidth = Math.min(viewWidth, window.innerWidth);
					var maxLeft = countWidth - viewWidth ;

					if (left < -maxLeft) {
						qtab.css({
							left: -maxLeft + "px",
							"transition": "200ms"
						});
					} else if (left > 0) {
						qtab.css({
							left: 0 + "px",
							"transition": "200ms"
						});
					}
				}
				if (isTrigClick && /touch/.test(e.type)) {
					Q(e.target).trigger("click");
				}
			}
			qtop.on({
				"touchstart": _start,
				"mousedown": _start,
				"touchmove": _move,
				"mousemove": _move,
				"touchend": _end,
				"mouseup": _end,
				"click": function(e) {
					var qtar = Q(e.target);
					var tabId = qtar.attr("tabId");
					if (tabId) {
						me.switching(tabId);

						click && click(e);
					}
				}
			});

		}
	}
	var thread;
	Q.extend(TabView.prototype, {
		switching: function(id) {
			var me = this;
			if (id) {
				if(me._config.isGoTop){
					scroll(0, 0);
				}
				me.items.removeClass("active");
				var qtar = Q("[tabId='" + id + "']", me.container);
				qtar.addClass("active");
				if(me.isMove){
					var qlast = me.items.last();
					var lisWidth =qlast.position().left + qlast.width() - 10;
					var posLeft = qtar.position().left;
					var realWidth = Math.min(window.innerWidth,me.container.width()) ;
					var halfWidth = realWidth/ 2;
					if (lisWidth > realWidth && posLeft < me.width - halfWidth) {
						clearTimeout(thread);
						thread = setTimeout(function() {
							var left = posLeft - realWidth / 4;
							left = left<0 ? 0 :left;
							if( me.items[0] == qtar[0] ){
								left = 0;
							}
							me.tab.css({
								left: -left + "px",
								"transition": "left 500ms"
							});
						}, 100);
					}
				}
			}
		},
		makeTabHtml: function (tabs) {
			var h = [];
			h.push('<ul class="tab"></div>');
			for (var i in tabs) {
				var item = tabs[i];
				if (i == 0) {
					h.push('<li tabId="' + item.id + '" class="active">' + item.name);
				} else {
					h.push('<li tabId="' + item.id + '">' + item.name);
				}
				h.push('</li>');
			}
			h.push('</ul>');
			return h.join("");
		}
	});
	TabView.version = 1.1;
	window.TabView = TabView;
	Q.isQmik && Q.sun.define(function(require, exports, module) {
		module.exports = TabView;
	});
})($);