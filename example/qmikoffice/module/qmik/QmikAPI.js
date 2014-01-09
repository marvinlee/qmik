(function(Q) {
	var intance;

	function QmikAPI() {}
	//单例方法
	QmikAPI.getInstance = function() {
		intance = intance || new QmikAPI();
		return intance;
	}

	Q.extend(QmikAPI.prototype, {
		//显示帮助模块入口 
		showHelpEnter: function() {
			var me=this;
			me.pop(Q("#area_qmik"));
		},
		//取对应帮助数据文件的url
		getIHelpUrl: function(id) {
			var ret = "data/qmik/base.json";
			switch (id) {
				case "qmikBase":
					ret = "data/qmik/base.json";
					break;
				case "qmikQuery":
					ret = "data/qmik/query.json";
					break;
				case "qmikEvent":
					ret = "data/qmik/event.json";
					break;
				case "qmikAjax":
					ret = "data/qmik/ajax.json";
					break;
				case "qmikSun":
					ret = "data/qmik/sun.json";
					break;
				case "qmikView":
					ret = "data/qmik/view.json";
					break;
			}
			return ret;
		},
		//显示基础模块帮助界面
		showHelp: function(id, url) {
			var me = this;
			var helpUlr = me.getIHelpUrl(id); //取得帮助内容的接口url
			var $tar = Q("#" + id);
			
			if ($tar.length < 1) {
				this.pop();
				//var gotoUrl=Q.url("img/goto.png");
				Q.getJSON(helpUlr, function(data) {
					var h = [];
					h.push('<li id="' + id + '" class="c-g-view c-g-area">');
					h.push('<div mid="left-nav" class="c-g-left-nav c-g-float">');
					h.push('<ul>');
					Q.each(data.list, function(i, item) {

						h.push('<li trig-type="click" url="' + item.url + '">' + item.title + '</li>');
					});
					h.push('</ul>');
					h.push('</div>');
					h.push('<div mid="main-view" class="c-g-main-view c-g-float"></div>');
					h.push('</div>');
					Q("#sheetsSub").html(h.join(""));

					if (url) {
						me.showHelpDetail(id,url); //如果有url,查看详细说明
					}
					Q("#sheetsSub [mid=left-nav] ul").on({
						click: function(e) {
							e.stopPropagation();
							var info = Q.nav.getInfo() || [];
							info[0] = id;
							info[1] = Q.encode(Q(e.target).attr("url"));
							if (info.module) {
								Q.nav.use({
									module: info.module, //模块名
									method: info.method, //方法名
									param: info
								});
							}
						}
					}).scrollBar();
				});
				if (Q("link[_src='" + Q.url('module/qmik/qmik.css') + "']").length < 1) {
					Q.getCss('module/qmik/qmik.css');
				}
				
			} else {
				me.showHelpDetail(id,url);
			}
		},
		showHelpDetail: function(id, url) { //查看详细说明
			Q.get(url, function(text) {
				var _view=Q("#sheetsSub [mid=main-view]");
				_view.html(text);
				_view.scrollBar();
			});
		}
	});
	Q.define(function(require, exports, module) {
		var View = require("View");
		Q.inherit(QmikAPI, View);
		intance = new QmikAPI();
		Q("#sheetsSub").css({height:window.innerHeight+"px"});
		module.exports = QmikAPI;
	});
})($);