/**
 * 公用组件
 */
(function($, define) {
	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	$.config( {
		baseURL : "/example/qmik/"
	});
	// 配置sun模块的基础路径
	if (location.protocol == "file:") {
		$.sun.config( {
			base : "file:///D:/code/github/qmik/"
		})
	}
	$.config({debug:true})
	// 定义模块名及请求路径
	$.sun.config( {
		alias : {
			// qmik组件
			"Qmik.nav" : "src/plugins/Qmik.nav.js",// 导航组件
			"Qmik.fade" : "src/plugins/Qmik.fn.fade",//
			"Qmik.tree" : "src/plugins/Qmik.fn.tree",// 树型菜单组件
			// ////////////////////////////////////////////
			"beautify" : $.url("js/jsformate/beautify"),//  
			// "ga" : $.url("js/jsformate/ga"),//
			// "htmlBeautify" : $.url("js/jsformate/HTML-Beautify"),//
			"doing" : $.url("js/jsformate/doing"),//
			// /
			"index" : $.url("js/index.js"),
			"nav" : $.url("js/nav"),
			"home" : $.url("js/home"),
			"download" : $.url("js/download"),
			"api" : $.url("js/api"),
			"about" : $.url("js/about")
		},
		// 预加载的模块
		preload : [
			"Qmik.nav"
		]
	}); 
	window.onerror=function(e){
		$.log("window.onerror:errrrrr:"+e)
	}
})(Qmik, Qmik.sun.define);
