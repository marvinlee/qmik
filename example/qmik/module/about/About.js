/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	console.log("1")
	define(function(require, exports, module) {
		console.log("define")
		require("Qmik.fn.fade");//依赖fade组件
		var nav = require("Nav");//依赖导航模块
		console.log(nav)
		$.extend(exports, {
			//显示首页
			showAbout : function(id) {
				console.log("---showAbout")
				var main = $("#main_module");
				$.get("module/about/about.html", function(data) {
					main.html(data);//填充内容
					main.fadeOut(1, 1);//动画显示首页
				});
			}
		});
	});
})(Qmik, Qmik.sun.define);
