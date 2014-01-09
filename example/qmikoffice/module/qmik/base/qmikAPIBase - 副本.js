(function(Q) {
	function QmikAPI() {};
	//查看详细说明
	function detail(url) {
		Q.get(url, function(text) {
			Q("#sheetsSub [mid=main-view]").html(text);
		})
	}
	Q.extend(QmikAPI.prototype, {
		//显示基础模块帮助界面
		showView: function(url) {
			var me = this;
			var $tar = Q("#qmikBase");
			if ($tar.length < 1) {
				this.pop();
				Q.getJSON('data/qmik/base.json', function(data) {
					var h = [];
					h.push('<li id="qmikBase" class="c-view c-area">');
					h.push('<div mid="left-nav" class="c-left-nav c-float">');
					h.push('<ul>');
					Q.each(data.list, function(i, item) {
						h.push('<li trig-type="click" url="' + item.url + '">' + item.title + '</li>');
					});
					h.push('</ul>');
					h.push('</div>');
					h.push('<div mid="main-view" class="c-main-view c-float"></div>');
					h.push('</div>');
					Q("#sheetsSub").append(h.join(""));

					if (url) {
						detail(url);//如果有url,查看详细说明
					}
					Q("#sheetsSub [mid=left-nav]").on({
						touchstart: function(e) {
							var $target = Q(e.target);
							var type = $target.attr("trig-type");
							if (type) {
								$target.trigger(type);
							}
						},
						click: function(e) {
							var info = Q.nav.getInfo() || [];
							info[0]=Q.encode(Q(e.target).attr("url"));
							if (info.module) {
								Q.nav.use({
									module: info.module, //模块名
									method: info.method, //方法名
									param: info
								});
							}
						}
					}).scroll();
				});
				Q.getCss('module/qmik/qmik.css');
			}else{
				detail(url);
			}
		}
	});
	Q.define(function(require, exports, module) {
		var BaseAct = require("BaseAct");
		require("Qmik.fn.scoll");
		Q.inherit(QmikAPI, BaseAct);
		module.exports = new QmikAPI();
	});
})($);