/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	$.log("get module download")
	define(function(require, exports, module) {
		var index = require("index");
		function exp(id) {
			$.log("use module download;");
			var main = $("#main");
			$.get("view/download.html", function(data) {
				main.html(data);
				main.fadeOut(1, 1);
			})
			index.showNav(id);
			$(".panel").hide();
			$("#download").show();
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
