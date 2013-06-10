/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	$.log("define module home:" + $.now());
	define(function(require, exports, module) {
		var index = require("index");
		$.log("define init module home:" + $.now())
		function exp(id) {
			$.log("use module home;");
			$("#head").css("background", "#ffffff");
			var main=$("#main");
			$.get("view/home.html", function(data) {
				main.html(data);
				main.fadeOut(1,1);
			});
			index.showNav(id)
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
