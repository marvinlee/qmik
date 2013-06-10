/**
 * 网站共用组件
 */
(function(Q, define) {
	var doc = document, win = window, loc = location;
	$.log("define module index")
	define(function(require, exports, module) {
		$.log("define init module index")
		require("Qmik.fade");
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
				$.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>callback index.init")
				$(document).ready(function() {
					$.log("-----------------------------------init ready;")
					var m = document.getElementById("about");
				 
					$("#head a[tag=nav]").click(function(a) {
						$.log("1:click:>module:"+$(this).attr("module"))
						//alert("1:click");
						//alert($(this).attr("module")+"--"+$(this).attr("method"))
						$.nav.use( {
							module : $(this).attr("module"),//模块名
							method : $(this).attr("method"),//方法名
							param : [//参数
								$(this).attr("id")
							]
						})
					});
				});
			}
		})
	});
})(Qmik, Qmik.define);
