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
			"Qmik.fade" : "src/plugins/Qmik.fn.fade",//
			"Qmik.tree" : "src/plugins/Qmik.fn.tree",// 树型菜单组件
			// ////////////////////////////////////////////
			"beautify" : Q.url("jsold/jsformate/beautify"),//  
			// "ga" : Q.url("js/jsformate/ga"),//
			// "htmlBeautify" : Q.url("js/jsformate/HTML-Beautify"),//
			"doing" : Q.url("jsold/jsformate/doing"),//
			// /
			"index" : Q.url("jsold/index.js"),
			"home" : Q.url("jsold/home"),
			"download" : Q.url("jsold/download"),
			"api" : Q.url("jsold/api"),
			"about" : Q.url("jsold/about")
		},
		// 预加载的模块
		preload : [
			"Qmik.nav"
		]
	});
 
	Q.use("Qmik.nav",function(Q1){
		Q.log("use Qmik.nav OK:");
		Q.log(Q1.toString().replace(/([ ]{2,}|\r|\n|\t)/g,""))
	});
 
	Q.use("Qmik.fade",function(Q1){
		Q.log("use Qmik.fade OK:");
		Q.log(Q1.toString().replace(/([ ]{2,}|\r|\n|\t)/g,""))
	});
	 
	Q.use("index",function(index){
		Q.log("use index OK:");
		Q.log(index.init.toString().replace(/([ ]{2,}|\r|\n|\t)/g,""))
		index.init();
	});
	window.onerror=function(e){
		Q.log("window.onerror:errrrrr:"+e)
	}
})(Qmik, Qmik.sun.define);
