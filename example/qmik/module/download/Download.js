/**
 * 首页家庭页面显示模块
 */
(function($, define) {
	define(function(require, exports, module) {
		var nav = require("Nav");
		function exp(id) {
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
