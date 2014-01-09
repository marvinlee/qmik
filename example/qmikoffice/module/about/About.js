(function(Q) {
	var intance;

	function About() {}
	//单例方法
	About.getInstance = function() {
		intance = intance || new About();
		return intance;
	}

	Q.extend(About.prototype, {
		show: function() {
			var me=this;
			me.push();
			Q("#sheets [mid=show] [view=main]").hide();
			Q("#sheets [mid=show] [mid=plug]").show();
			
			Q.get('module/about/about.html', function(txt) {
				txt = txt.replace(/\r|\n/g, "");
				Q("#sheets [mid=show] [mid=plug]").html(txt).scrollBar({
					update:function(xx){
						me.flush();
					}
				}).css({
					height:me.height()+"px"
				});
			});		
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
		var BaseAct = require("BaseAct");
		require("Qmik.fn.scrollBar");
		Q.inherit(About, BaseAct);
		intance = new About();
		module.exports = About;
	});
})($);