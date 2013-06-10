/**
 * 首页组件
 */
(function(Q, define) {
	var doc = document, win = window, loc = location;
	$.log("define module index")
	define(function(require, exports, module) {
		$.log("define init module index")
		require("Qmik.fade");
		var nav = require("nav");
		$.extend(exports, {
			// 显示导航
			showNav : function(id) {
				$.log("[index].showNav")
				$("div.panel").hide();
				$("#head a").rmClass("head_click_a");
				id = id || "home";
				var tar = $("#" + id);
				var flag = tar.attr("url") || "home";
				$("#" + flag).fadeOut(1);
				tar.addClass("head_click_a");
			},
			// 初始化首页
			init : function() {
				$(document).ready(function() {
					nav.showHeader();//显示头部导航
				});
			}
		})
	});
})(Qmik, Qmik.define);
