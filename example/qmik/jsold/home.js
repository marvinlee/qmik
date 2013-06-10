/**
 * 首页家庭页面显示模块
 */
(function(Q, define) {
	Q.log("define module home:"+Q.now())
	define(function(require, exports, module) {
		var index = require("index");
		Q.log("define init module home:"+Q.now())
		function exp(id) {
			Q.log("use module home;")
			Q("#head").css("background","#00ffff")
			index.showNav(id)
		}
		module.exports = exp
	})
})(Qmik, Qmik.sun.define);
