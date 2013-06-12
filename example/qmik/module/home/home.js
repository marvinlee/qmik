/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	define(function(require, exports, module) {
		require("Qmik.fn.fade");
		var nav = require("nav");
		$.log("define init module home:" + $.now())
		function exp(id) {
			$.log("use module home;");
			var main = $("#main_module");
			$.get("module/home/home.html", function(data) {
				main.html(data);
				main.fadeOut(1, 1);
				nav.showShortcut();
			});
		}
		module.exports = exp
	});
})(Qmik, Qmik.sun.define);
