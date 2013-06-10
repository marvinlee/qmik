/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	define(function(require, exports, module) {
		var index = require("index");
		var nav = require("nav");
		$.log("define init module home:" + $.now())
		function exp(id) {
			$.log("use module home;");
			var main = $("#main_module");
			$.get("view/home.html", function(data) {
				main.html(data);
				main.fadeOut(1, 1);
				nav.showShortcut();
			});
			index.showNav(id)
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
