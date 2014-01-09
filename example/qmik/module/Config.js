/**
* 公用组件
*/
(function($, define) {
	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	$.config({
		context : "/example/qmik/"
	});
	// 配置sun模块的基础路径
	if (location.protocol == "file:") {
		$.sun.config({
			base : "file:///D:/code/github/qmik/"
		})
	}
	$.config({
		debug : true
	});
	// 定义模块名及请求路径
	$.sun.config({
		alias : {
			// qmik组件
			"Qmik.nav" : $.url("/src/plugins/Qmik.nav.js?adsf"),//
			"Qmik.fn.fade" : $.url("/assets/plugins/Qmik.fn.fade.js?asdfasdf"),//
			"Qmik.fn.tree" : $.url("/src/plugins/Qmik.fn.tree.js"),// 树型菜单组件
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
		},
		preload : [
			"Qmik.nav"
		]
	});
})(Qmik, Qmik.sun.define);
