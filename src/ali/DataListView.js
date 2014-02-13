(function(Q) {
	if (!Q.now) {
		Q.now = function(d) {
			return (d || 0) + new Date().getTime()
		}
	}
	if (!Q.isNull) {
		Q.isNull = function(d) {
			return d == null || d == undefined
		}
	}
	var gCss = {
		"backface-visibility": "hidden",
		"-webkit-backface-visibility": "hidden",
		"-ms-backface-visibility": "hidden",
		"-moz-backface-visibility": "hidden"
	};

	function DataView(opt) {
		var me = this;
		var dataSource = opt.dataSource;
		var tabs = dataSource.tabs;
		var data = dataSource.data;
		var qcontainer = Q(opt.container);
		var click = opt.click;
		me._config = opt;
		me.dataSource = dataSource;
		me.container = qcontainer;
		me.switching = opt.switching;
		//me.tabView = opt.tabView;
		//创建每个tab对应的显示数据的容器
		var html = me._makeContainerHtml(tabs);
		qcontainer.html(html);

		qcontainer.css({
			minWidth: "10000%"
		});
		me.items = qcontainer.children("li");
		me.items.css({
			width: qcontainer.parent().width() + "px"
		});
		qcontainer.css(gCss);
		if (qcontainer.attr("bindSlide") != "true") {
			qcontainer.attr("bindSlide", "true");
			////////////////////////
			var navDiff = 15;
			var oStart = {
				x: 0,
				y: 0,
				t: 0
			};
			var oDiff = {
				x: 0,
				y: 0
			};
			var direct;
			var isDeal = true;
			var isTrigClick = true;
			var startLeft = 0;
			//确定滑动方向,垂直=Y or 水平=X, 未确定=null
			function sureDirect(e) {
				var touch = e.touches ? e.touches[0] : e;
				oDiff.x = touch.clientX - oStart.x;
				oDiff.y = touch.clientY - oStart.y;
				if (Math.abs(oDiff.y) >= 50) {
					//return "Y"
					return null;
				}
				if (oDiff.x >= navDiff) {
					return "-X"
				} else if (oDiff.x <= -navDiff) {
					return "+X"
				}
				return null;
			}
			//延迟设置状态机,防止快速多次点击滑动,可能出现的异常现象
			function delaySetState(ttl) {
				clearTimeout(delaySetState.thread);
				delaySetState.thread = setTimeout(function() {
					isDeal = true;
				}, ttl || 200);
			}
			//滑动开始
			function _start(e) {
				direct = null;
				isStart = true;
				isTrigClick = true;
				//delaySetState(1000);
				var touch = e.touches ? e.touches[0] : e;
				oStart.x = touch.clientX;
				oStart.y = touch.clientY;
				oStart.t = Q.now();
				startLeft = qcontainer.position().left;

			}
			//滑动
			function _move(e) {
				isTrigClick = false;
				direct = sureDirect(e);
				if (direct && direct != "Y" && (Q.isNull(e.button) || e.button == 0)) {
					stop(e);
				}
			}
			//阻止默认形为
			function stop(e) {
				e.preventDefault();
				//e.stopPropagation();
			}
			//滑动结束
			function _end(e) {
				if (isDeal && direct) {
					isDeal = false;
					stop(e);
					delaySetState(200);
					if ((Q.now() - oStart.t < 500) && (Q.isNull(e.button) || e.button == 0)) {
						var id;
						switch (direct) {
							case "+X":
								id = Q(e.target).closest(".item_list").next().attr("id");
								break;
							case "-X":
								id = Q(e.target).closest(".item_list").prev().attr("id");
								break;
						}
						if (id) {
							me.showTab(id);
							me.switching && me.switching({
								tabId: id,
								direct: direct
							});
							//me.tabView && me.tabView.switching(id);
						}
					}
				}
				direct = null;
				if (isTrigClick && /touch/.test(e.type) && e.button == 0) { //是touch类型事件,才会触发
					Q(e.target).trigger("click");
				}
			}
			//如果没有绑定过事件,就绑定下
			qcontainer.on({
				"touchstart": _start,
				"mouseover": _start,
				"mousedown": _start,
				"touchmove": _move,
				"mousemove": _move,
				"touchend": _end,
				"mouseup": _end,
				"click": function(e) {
					click && click(e);
				}
			});
		}
	}
	Q.extend(DataView.prototype, {
		_loadTab: function(opt) {
			var me = this;
			var success = opt.success;
			var dataSource = me.dataSource;
			var tabId = opt.tabId;
			var data = dataSource.data[tabId];
			if (data) {
				success && success({
					list: data
				});
			}
		},
		showTab: function(tabId) {
			var me = this;
			if (!tabId) return;
			var qtab = me.getCurTab();
			if (qtab.attr("id") != tabId) {
				var qnext = Q("#" + tabId, me.container);
				var qcur = me.getCurTab();
				me._loadTab({
					tabId: tabId,
					success: function(data) {
						var list = data.list || [];
						var html = me._makeListHtml(list, Q(".item", qnext).length + list.length);
						qnext.append(html);
						setTimeout(function(){
							me.filling();
						},100);
					}
				});
				me.items.css(gCss);
				me.items.removeClass("active");
				qnext.addClass("active");
				clearTimeout(me._tttid);
				me._tttid = setTimeout(function() {
					me.items.each(function(i, dom) {
						if (dom != me.getCurTab()[0]) {
							Q(".items_container", dom).remove();
						}
					});
				}, 100);
				me.pop(qcur, qnext);
				me.onShow();
			}
		},
		pop: function(qcur, qtarget) {
			var me = this;
			var container = me.container;
			qtarget = Q(qtarget);
			var left = qtarget.position().left;
			me.__scroll = true;
			container.css({
				"-webkit-transform": "translateX(" + -left + "px)",
				"transform": "translateX(" + -left + "px)",
				"transition": "300ms"
			});
			Q(window).trigger("scroll");
		},
		//添加元素
		appendItems: function(list) {
			var me = this;
			var html = me._makeListHtml(list);
			var qcur = me.getCurTab();
			me.removeFilling();
			qcur.append(html);
			me.filling();
		},
		_makeContainerHtml: function(tabs) {
			var h = [];
			for (var i in tabs) {
				var item = tabs[i];
				h.push('<li id="' + item.id + '" class="item_list">');
				h.push('</li>');
			}
			return h.join("");
		},
		_makeListHtml: function(list) {
			var me = this;
			list = list || [];
			var h = ['<div class="items_container">'];
			var qcur = me.getCurTab();
			for (var i = 0; i < list.length; i++) {
				try{
					list[i] && h.push(me.makeItemHtml(i, list[i], list.length, qcur.length + list.length));
				}catch(e){
					console && console.log(e);
				}
			}
			h.push('</div>');
			return h.join("");
		},
		/**
			生成每个item的显示
			index:在添加list里的索引
			item:对象,
			size:list的长度

		*/
		makeItemHtml: function(index, item, size, countSize) {
			var h = [];
			var img = item.image || "";
			img = img.replace(/_\d+x\d+\..+$/, "") + '_160x160.jpg';
			h.push('<div class="item">');
			/////////////
			h.push('<a href="' + item.action + '" class="item_block">');
			if (countSize > 16) {
				h.push('<img class="item_photo lazy" dataimg="' + img + '">');
			} else {
				h.push('<img class="item_photo lazy" src="' + img + '">');
			}
			h.push('</a>');
			h.push('<div class="item_info">');
			h.push('<p class="item_name">');
			h.push(item.name);
			h.push('</p>');
			h.push('<div class="item_bottom">');
			item.lowPrice && h.push('<span class="item_price">￥' + item.lowPrice + '</span> ');
			item.highPrice && h.push('<del>' + item.highPrice + '</del>');
			item.buyAmount && h.push('<span class="item_amount">' + item.buyAmount + '人购买</span>');
			h.push('</div>');
			h.push('</div>')
			////////////////////////
			h.push('</div>');
			return h.join("");
		},
		getCurTab: function() {
			return Q(".active", this.container).first();
		},
		removeFilling: function(){
			Q(".items_container > .filling",this.getCurTab()).remove()
		},
		//重置视口大小
		onShow: function() {},
		filling: function() {
			var me = this;
			var qcontainer = Q(".items_container",me.getCurTab());
			me.removeFilling();
			var qitems = Q(".item",qcontainer);
			var itemWidth = qitems.width();
			if(itemWidth > 0){
				var cols = parseInt(qcontainer.width()/ itemWidth);
				var mod = qitems.length % cols;
				function append(size){
					var h =[];
					for(var i=0;i<size;i++){
						h.push('<div class="item filling"></div>');
					}
					qcontainer.append(h.join(""));
				}
				mod > 0 && append(cols - mod);
			}
		}
	});
	DataView.version = 1.1;
	Q.isQmik && Q.sun.define(function(require, exports, module) {
		module.exports = DataView;
	});
	window.DataListView = DataView;
})($);