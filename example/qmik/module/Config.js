/**
 * 公用组件
 */
(function($, define) {
	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	$.config( {
		context : "/example/qmik/"
	});
	// 配置sun模块的基础路径
	if (location.protocol == "file:") {
		$.sun.config( {
			base : "file:///D:/code/github/qmik/"
		})
	}
	$.config( {
		debug : true
	})
	// 定义模块名及请求路径
	$.sun.config( {
		alias : {
			// qmik组件
			"Qmik.fn.fade" : $.url("/src/plugins/Qmik.fn.fade"),//
			"Qmik.fn.tree" : $.url("/src/plugins/Qmik.fn.tree"),// 树型菜单组件
			// ////////////////////////////////////////////
			//"beautify" : "module/jsformate/beautify",//  
			// "ga" : $.url("js/jsformate/ga"),//
			// "htmlBeautify" : $.url("js/jsformate/HTML-Beautify"),//
			//"doing" : $.url("module/jsformate/doing"),//
			// /
			"Nav" : "module/nav/Nav",
			"Home" : "module/home/Home",
			"Download" : "module/download/Download",
			"API" : "module/api/API",
			"About" : "module/about/About"
		}
	});
	window.onerror = function(e) {
		$.log("window.onerror:errrrrr:" + e)
	}
})(Qmik, Qmik.sun.define);
