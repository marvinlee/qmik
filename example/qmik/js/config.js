/**
 * 公用组件
 */
(function(Q, define) {
	if (location.protocol == "file:") {
		Q.sun.config( {
			base : "file:///D:/code/github/qmik/"
		})
	}
	// 定义模块名及请求路径
	Q.sun.config( {
		alias : {
			"Qmik.nav" : "/src/plugins/Qmik.nav",
			"Qmik.fade" : "/src/plugins/Qmik.fade",
			"Qmik.tree" : "/src/plugins/Qmik.tree",
			"index" : "/example/qmik/js/index",
			"home" : "/example/qmik/js/home",
			"download" : "/example/qmik/js/download",
			"api" : "/example/qmik/js/api"
		},
		// 预加载的模块
		preload : [
			"Qmik.nav"
		]
	});
	Q.use("Qmik.nav");
})(Qmik, Qmik.sun.define);
