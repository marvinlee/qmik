/**
 * 显示新闻模块
 */
define(function(require, exports, module) {
	$("#show").click(function(e) {
		var target = $(e.target || e.srcElement);
		if (target.attr("tagName") == "A") {
			var d = document.createElement("script");
			d.type = "text/javascript";
			d.src = target.attr("_href");
			$("head").append(d);
			d.onload = d.onreadystatechange = function(e) {
 
			}
		}
	});
	(function($) {
		module.exports = function() {
			function href() {
				$("a").each(function(i, v) {
					var qv = $(v);
					qv.attr("_href", qv.attr("href")).rmAttr("href");
				})
			}
			$.ajax( {
				url : "/example/navdemo/test/news.txt",
				success : function(data) {
					$("#show").html(data);
					href();
				}
			});
		}
	})(Qmik);
})
