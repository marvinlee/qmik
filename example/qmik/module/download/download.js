/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	$.log("get module download")
	define(function(require, exports, module) {
 
		var nav = require("nav");
		function exp(id) {
			$.log("use module download;");
			var main = $("#main_module");
			$.get("module/download/download.html", function(data) {
				main.html(data);
				main.fadeOut(1, 1);
				nav.showShortcut();
			})
 
			$(".panel").hide();
			$("#download").show();
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
