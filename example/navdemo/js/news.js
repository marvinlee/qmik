/**
 * 显示新闻模块
 */
define("news", function(require, exports, module) {
	(function($) {
		module.exports = function() {
			$.ajax( {
				url : "/example/navdemo/test/news.txt",
				success : function(data) {
					$("#show").html(data)
				}
			});
		}
	})(Qmik);
})
