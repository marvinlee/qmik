(function(Q) {
	var intance;

	function About() {}
	//单例方法
	About.getInstance = function() {
		intance = intance || new About();
		return intance;
	}

	Q.extend(About.prototype, {
		showView: function() {
			var me=this;
			var qiframe = Q("#areaAbout iframe");
			if(Q.likeNull(qiframe.attr("src"))){
				if(qiframe.attr("_src")){
					qiframe[0].src=Q.url(qiframe.attr("_src"));
				}
			}
			View.show(Q("#areaAbout"));
		},
		showHelp: function(plug) {
			var me=this;
			me.pop();
			Q("#navGoBack").attr("go-type","go-plug")
			Q.get('data/plug/'+plug+'.html', function(txt) {
				var _view = Q("#sheetsSub");
				_view.html(txt);
				_view.scrollBar({
					update:function(xx){
						me.flush();
					}
				});
			});
			if (Q("link[_src='" + Q.url('module/qmik/qmik.css') + "']").length < 1) {
				Q.getCss('module/qmik/qmik.css');
			}
		}
	});
	Q.define(function(require, exports, module) {
		var View = require("View");
		Q.inherit(About, View);
		intance = new About();
		module.exports = About;
	});
})($);