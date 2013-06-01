/**
 * 公用组件
 */
(function(Q, define) {
	// 配置Qmik工程的基础路径,如果没有配置,默认= location.protocol + "//" + location.hostname
	Q.config( {
		baseURL : "/example/qmik/"
	});
	// 配置sun模块的基础路径
	if (location.protocol == "file:") {
		Q.sun.config( {
			base : "file:///D:/code/github/qmik/"
		})
	}
	// 定义模块名及请求路径
	Q.sun.config( {
		alias : {
			// qmik组件
			"Qmik.nav" : "src/plugins/Qmik.nav.js",// 导航组件
			"Qmik.fade" : "src/plugins/Qmik.fade",//
			"Qmik.tree" : "src/plugins/Qmik.tree",// 树型菜单组件
			// ////////////////////////////////////////////
			"beautify" : Q.url("js/jsformate/beautify"),//  
			// "ga" : Q.url("js/jsformate/ga"),//
			// "htmlBeautify" : Q.url("js/jsformate/HTML-Beautify"),//
			"doing" : Q.url("js/jsformate/doing"),//
			// /
			"index" : Q.url("js/index.js"),
			"home" : Q.url("js/home"),
			"download" : Q.url("js/download"),
			"api" : Q.url("js/api"),
			"about" : Q.url("js/about")
		},
		// 预加载的模块
		preload : [
			"Qmik.nav"
		]
	});
	console.log(Q.sun.config())
	Q.use("Qmik.nav");
})(Qmik, Qmik.sun.define);
